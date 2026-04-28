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

  const job = await Job.findById(jobId)
    .populate("author", "name image")
    .populate("company", "companyName companyLogo");

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
  // Super Senior approach: Dynamic filter building and concurrent operations
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

  const cacheKey = `jobs:search:${crypto.createHash("md5").update(JSON.stringify(params)).digest("hex")}`;

  // TODO: implement Redis caching later one
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    console.error("Redis Read Error:", error);
  }

  // Build Query
  const filter: any = { isActive: true };

  if (searchTerm) {
    const searchRegex = { $regex: searchTerm, $options: "i" };
    filter.$or = [
      { title: searchRegex },
      { category: searchRegex },
      { subcategory: searchRegex },
      { description: searchRegex },
      { requirements: searchRegex },
      { skills: searchRegex },
    ];
  }

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (type) filter.type = type;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (locationType) filter.locationType = locationType;
  if (location) filter.location = { $regex: location, $options: "i" };

  if (minSalary !== undefined || maxSalary !== undefined) {
    filter.salaryMin = {};
    if (minSalary !== undefined) filter.salaryMin.$gte = minSalary;
    if (maxSalary !== undefined) filter.salaryMin.$lte = maxSalary;
  }

  // Execute concurrently
  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .select(
        "_id author title category subcategory type location locationType salaryMin salaryMax salaryPeriod experienceLevel description skills applicationDeadline createdAt isActive positions",
      )
      .populate("company", "companyName companyLogo")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean({ virtuals: true }),
    Job.countDocuments(filter),

    // TODO: full company logo .populate("company", "companyName companyLogo companyLocation industries website")
  ]);

  const totalPages = Math.ceil(total / limit);
  const result = {
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalJobs: total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };

  try {
    await redis.setex(cacheKey, 300, JSON.stringify(result));
  } catch (error) {
    console.error("Redis Write Error:", error);
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
