import Job from "./job.model";
import { IJob } from "./job.model";
import redis from "../../config/redis";
import crypto from "crypto";

// Get all jobs with optional filters and Redis caching
const getAllJobs = async (filters: any = {}) => {
  // Create a cache key based on filters
  const cacheKey = `allJobs:${crypto
    .createHash("md5")
    .update(JSON.stringify(filters))
    .digest("hex")}`;

  try {
    // Try to get cached result
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      console.log("Cache hit for getAllJobs");
      return JSON.parse(cachedResult);
    }
  } catch (error) {
    console.log("Error fetching from Redis cache:", error);
    // Continue with database query if cache fails
  }

  const jobs = await Job.find(filters);

  try {
    // Store the result in Redis with an expiration time (300 seconds = 5 minutes)
    await redis.setex(cacheKey, 300, JSON.stringify(jobs));
  } catch (error) {
    console.log("Error storing to Redis cache:", error);
    // Continue anyway even if caching fails
  }

  return jobs;
};

// Get job by ID with Redis caching
const getJobById = async (jobId: string) => {
  const cacheKey = `job:${jobId}`;

  try {
    // Try to get cached result
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      console.log("Cache hit for getJobById");
      return JSON.parse(cachedResult);
    }
  } catch (error) {
    console.log("Error fetching from Redis cache:", error);
    // Continue with database query if cache fails
  }

  const job = await Job.findById(jobId);

  if (job) {
    try {
      // Store the result in Redis with an expiration time (600 seconds = 10 minutes)
      await redis.setex(cacheKey, 600, JSON.stringify(job));
    } catch (error) {
      console.log("Error storing to Redis cache:", error);
      // Continue anyway even if caching fails
    }
  }

  return job;
};

// Get jobs by author ID
const getJobsByAuthorId = async (authorId: string) => {
  return await Job.find({ author: authorId })
    .select(
      "author title category subcategory type location locationType salaryMin salaryMax salaryPeriod experienceLevel description skills applicationDeadline createdAt isActive responsibilities requirements benefits positions",
    )
    .sort({ createdAt: -1 });
};

// Function to clear job search cache
const clearJobCache = async () => {
  try {
    // Delete all keys that start with "jobs:"
    const keys = await redis.keys("jobs:*");
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared ${keys.length} cache entries`);
    }
  } catch (error) {
    console.log("Error clearing Redis cache:", error);
  }
};

// Create a new job
const createJob = async (jobData: Partial<IJob>) => {
  const job = new Job(jobData);
  const savedJob = await job.save();

  // Clear cache after creating a job
  await clearJobCache();

  return savedJob;
};

// Update job by ID
const updateJob = async (jobId: string, updateData: Partial<IJob>) => {
  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
  });

  // Clear cache after updating a job
  await clearJobCache();

  return updatedJob;
};

// Delete job by ID
const deleteJob = async (jobId: string) => {
  const deletedJob = await Job.findByIdAndDelete(jobId);

  // Clear cache after deleting a job
  await clearJobCache();

  return deletedJob;
};

// Search jobs with advanced filters and pagination with Redis caching
const searchJobs = async (
  searchTerm?: string,
  category?: string,
  subcategory?: string,
  type?: string,
  experienceLevel?: string,
  location?: string,
  locationType?: string,
  minSalary?: number,
  maxSalary?: number,
  page: number = 1,
  limit: number = 10,
) => {
  // Create a cache key based on all parameters
  const params = {
    searchTerm,
    category,
    subcategory,
    type,
    experienceLevel,
    location,
    locationType,
    minSalary,
    maxSalary,
    page,
    limit,
  };

  // Generate a unique cache key from the parameters
  const cacheKey = `jobs:${crypto
    .createHash("md5")
    .update(JSON.stringify(params))
    .digest("hex")}`;

  try {
    // Try to get cached result
    const cachedResult = await redis.get(cacheKey);
    // remove that
    // if (cachedResult) {
    //   console.log("Cache hit for searchJobs");
    //   return JSON.parse(cachedResult);
    // }
  } catch (error) {
    console.log("Error fetching from Redis cache:", error);
    // Continue with database query if cache fails
  }

  // Build filter object
  const filter: any = {};

  // Filter by job type
  if (type) {
    filter.type = type;
  }

  // Filter by experience level
  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }

  // Filter by location type
  if (locationType) {
    filter.locationType = locationType;
  }

  // Filter by category
  if (category) {
    filter.category = category;
  }

  // Filter by subcategory
  if (subcategory) {
    filter.subcategory = subcategory;
  }

  // Filter by location
  if (location) {
    filter.location = location;
  }

  // Filter by salary range
  if (minSalary !== undefined || maxSalary !== undefined) {
    filter.salaryMin = filter.salaryMin || {};
    filter.salaryMax = filter.salaryMax || {};
    if (minSalary !== undefined) {
      filter.salaryMin.$gte = minSalary;
      filter.salaryMax.$gte = minSalary;
    }
    if (maxSalary !== undefined) {
      filter.salaryMin.$lte = maxSalary;
      filter.salaryMax.$lte = maxSalary;
    }
  }

  // Search in job title, category, subcategory, description, skills, and requirements
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, "i");
    filter.$or = [
      { title: searchRegex },
      { category: searchRegex },
      { subcategory: searchRegex },
      { description: searchRegex },
      { requirements: { $in: [searchRegex] } },
      { skills: { $in: [searchRegex] } },
    ];
  }

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Execute the query with pagination
  const jobs = await Job.find(filter)
    .select(
      "author title category subcategory type location locationType salaryMin salaryMax salaryPeriod experienceLevel description skills applicationDeadline createdAt isActive responsibilities requirements benefits positions",
    )
    .populate("author", "name")
    .populate("category", "name")
    .populate("subcategory", "name")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

  // Get total count for pagination info
  const total = await Job.countDocuments(filter);

  const result = {
    jobs,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJobs: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };

  try {
    // Store the result in Redis with an expiration time (300 seconds = 5 minutes)
    await redis.setex(cacheKey, 300, JSON.stringify(result));
  } catch (error) {
    console.log("Error storing to Redis cache:", error);
    // Continue anyway even if caching fails
  }

  return result;
};

// Seed database with dummy jobs
const seedJobs = async (jobs: Partial<IJob>[]) => {
  try {
    // Clear existing jobs
    await Job.deleteMany({});

    // Insert dummy jobs
    const createdJobs = await Job.insertMany(jobs);
    return createdJobs;
  } catch (error) {
    throw error;
  }
};

const jobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
  seedJobs,
  clearJobCache,
  getJobsByAuthorId,
};

export default jobService;
