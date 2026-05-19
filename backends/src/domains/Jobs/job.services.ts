import Job from "./job.model";
import { IJob } from "./job.model";
import redis from "../../config/redis";
import crypto from "crypto";
import mongoose from "mongoose";

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
      return JSON.parse(cachedResult);
    }
  } catch (error) {
    console.log("Error fetching from Redis cache:", error);
    // Continue with database query if cache fails
  }

  const jobs = await Job.find(filters).sort({ createdAt: -1 });

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
    // Delete all keys that start with "jobs:" or "allJobs:"
    const keys1 = await redis.keys("jobs:*");
    const keys2 = await redis.keys("allJobs:*");
    const keys = [...keys1, ...keys2];
    if (keys.length > 0) {
      await redis.del(...keys);
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
interface SearchJobsParams {
  searchTerm?: string;
  category?: string;
  subcategory?: string;
  type?: string;
  experienceLevel?: string;
  location?: string;
  locationType?: string;
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  limit?: number;
  salaryRanges?: string;
  companySizes?: string;
  postedDate?: string;
}

// Search jobs with advanced filters and pagination with Redis caching
const searchJobs = async (options: SearchJobsParams = {}) => {
  const {
    searchTerm,
    category,
    subcategory,
    type,
    experienceLevel,
    location,
    locationType,
    minSalary,
    maxSalary,
    page = 1,
    limit = 10,
    salaryRanges,
    companySizes,
    postedDate,
  } = options;

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
    salaryRanges,
    companySizes,
    postedDate,
  };

  const cacheKey = `jobs:search:${crypto.createHash("md5").update(JSON.stringify(params)).digest("hex")}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    console.error("Redis Read Error:", error);
  }

  // Build Query Conditions
  const filterConditions: any[] = [{ isActive: true }];

  if (searchTerm) {
    const searchRegex = { $regex: searchTerm, $options: "i" };
    filterConditions.push({
      $or: [
        { title: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { description: searchRegex },
        { requirements: searchRegex },
        { skills: searchRegex },
      ],
    });
  }

  if (category) filterConditions.push({ category });
  if (subcategory) filterConditions.push({ subcategory });

  if (type) {
    const types = type
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (types.length > 0) {
      filterConditions.push({ type: { $in: types } });
    }
  }

  if (experienceLevel) {
    const levels = experienceLevel
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    if (levels.length > 0) {
      filterConditions.push({ experienceLevel: { $in: levels } });
    }
  }

  if (locationType) filterConditions.push({ locationType });
  if (location)
    filterConditions.push({ location: { $regex: location, $options: "i" } });

  if (minSalary !== undefined || maxSalary !== undefined) {
    const salaryCond: any = {};
    if (minSalary !== undefined) salaryCond.$gte = minSalary;
    if (maxSalary !== undefined) salaryCond.$lte = maxSalary;
    filterConditions.push({ salaryMin: salaryCond });
  }

  if (salaryRanges) {
    const ranges = salaryRanges.split(",").map((r) => {
      const [minStr, maxStr] = r.split("-");
      const min = parseFloat(minStr);
      const max = maxStr === "Infinity" ? Infinity : parseFloat(maxStr);
      const cond: any = {};
      if (max !== Infinity) cond.salaryMin = { $lte: max };
      cond.salaryMax = { $gte: min };
      return cond;
    });
    if (ranges.length > 0) {
      filterConditions.push({ $or: ranges });
    }
  }

  if (postedDate) {
    let days = 0;
    if (postedDate === "today") days = 1;
    else if (postedDate === "3days") days = 3;
    else if (postedDate === "week") days = 7;
    else if (postedDate === "2weeks") days = 14;
    else if (postedDate === "month") days = 30;

    if (days > 0) {
      const threshold = new Date();
      threshold.setDate(threshold.getDate() - days);
      filterConditions.push({ createdAt: { $gte: threshold } });
    }
  }

  if (companySizes) {
    const sizes = companySizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (sizes.length > 0) {
      const Company = mongoose.model("Company");
      const companies = await Company.find({ companySize: { $in: sizes } })
        .select("_id")
        .lean();
      const companyIds = companies.map((c) => c._id);
      filterConditions.push({ company: { $in: companyIds } });
    }
  }

  const filter = { $and: filterConditions };

  // Execute concurrently
  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .select(
        "_id author title category subcategory type location locationType salaryMin salaryMax salaryPeriod experienceLevel description skills applicationDeadline createdAt isActive positions",
      )
      .populate("company", "companyName companyLogo companySize")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean({ virtuals: true }),
    Job.countDocuments(filter),
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
