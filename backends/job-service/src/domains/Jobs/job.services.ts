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
  jobType?: string,
  experience?: string,
  location?: string,
  minSalary?: number,
  maxSalary?: number,
  page: number = 1,
  limit: number = 10
) => {
  // Create a cache key based on all parameters
  const params = {
    searchTerm,
    jobType,
    experience,
    location,
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
    if (cachedResult) {
      console.log("Cache hit for searchJobs");
      return JSON.parse(cachedResult);
    }
  } catch (error) {
    console.log("Error fetching from Redis cache:", error);
    // Continue with database query if cache fails
  }

  // Build filter object
  const filter: any = {};

  // Filter by job type
  if (jobType) {
    filter.job_type = jobType;
  }

  // Filter by experience
  if (experience) {
    filter.experience = experience;
  }

  // Filter by location
  if (location) {
    filter.location = location;
  }

  // Filter by salary range
  if (minSalary !== undefined || maxSalary !== undefined) {
    filter.salary = {};
    if (minSalary !== undefined) {
      filter.salary.$gte = minSalary;
    }
    if (maxSalary !== undefined) {
      filter.salary.$lte = maxSalary;
    }
  }

  // Search in job title, company name, and skills/requirements
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, "i");
    filter.$or = [
      { job_title: searchRegex },
      { company_name: searchRegex },
      { description: searchRegex },
      { requirements: { $in: [searchRegex] } },
      { skills: { $in: [searchRegex] } }, // Assuming skills is an array field
    ];
  }

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Execute the query with pagination
  const jobs = await Job.find(filter)
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
};

export default jobService;
