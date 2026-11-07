import Job from "./job.model";
import { IJob } from "./job.model";
import redis from "../../config/redis";
import crypto from "crypto";
import mongoose from "mongoose";
import { escapeRegex, assertId } from "../../lib/query";

// Get all jobs with optional filters and Redis caching
const getAllJobs = async (filters: any = {}) => {
  // Create a cache key based on filters
  const cacheKey = `allJobs:v${await currentSearchVersion()}:${crypto
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

  const jobs = await Job.find({ ...filters, isActive: true, isDeleted: { $ne: true }, applicationDeadline: { $gte: new Date() } }).sort({ createdAt: -1 }).limit(50);

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
const getJobById = async (jobId: string, requesterId?: string) => {
  assertId(jobId);
  if (requesterId) return Job.findOne({ _id: jobId, $or: [{ isActive: true, isDeleted: { $ne: true }, applicationDeadline: { $gte: new Date() } }, { author: requesterId, isDeleted: { $ne: true } }] }).populate("author", "name image").populate("company", "companyName companyLogo");
  const cacheKey = `job:${jobId}`;

  try {
    // Try to get cached result
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      const cachedJob = JSON.parse(cachedResult);
      if (cachedJob?.applicationDeadline && new Date(cachedJob.applicationDeadline).getTime() >= Date.now()) return cachedJob;
    }
  } catch (error) {
    console.log("Error fetching from Redis cache:", error);
    // Continue with database query if cache fails
  }

  const job = await Job.findOne({ _id: jobId, isActive: true, isDeleted: { $ne: true }, applicationDeadline: { $gte: new Date() } })
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
const getJobsByAuthorId = async (authorId: string, requesterId?: string) => {
  assertId(authorId);
  return await Job.find({ author: authorId, isDeleted: { $ne: true }, ...(requesterId === authorId ? {} : { isActive: true, applicationDeadline: { $gte: new Date() } }) })
    .select(
      "author title category subcategory type location locationType salaryMin salaryMax salaryPeriod experienceLevel description skills applicationDeadline createdAt isActive responsibilities requirements benefits positions",
    )
    .sort({ createdAt: -1 });
};

// Function to clear job search cache
const currentSearchVersion = async () => {
  try { return (await redis.get("jobhub:search:version")) || "1"; } catch { return String(Date.now()); }
};
const clearJobCache = async (jobId?: string) => {
  try {
    await redis.incr("jobhub:search:version");
    if (jobId) await redis.del(`job:${jobId}`);
  } catch { /* cache TTL also limits stale results */ }
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
const updateJob = async (jobId: string, updateData: Partial<IJob>, requesterId: string) => {
  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId, author: requesterId, isDeleted: { $ne: true } },
    { $set: Object.fromEntries(Object.entries(updateData).filter(([key]) => key !== "author")) },
    { new: true, runValidators: true });

  // Clear cache after updating a job
  if (updatedJob) await clearJobCache(jobId);

  return updatedJob;
};

// Delete job by ID
const deleteJob = async (jobId: string, requesterId: string) => {
  const deletedJob = await Job.findOneAndUpdate({ _id: jobId, author: requesterId, isDeleted: { $ne: true } },
    { $set: { isDeleted: true, isActive: false } }, { new: true });

  // Clear cache after deleting a job
  if (deletedJob) await clearJobCache(jobId);

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

  const cacheKey = `jobs:search:v${await currentSearchVersion()}:${crypto.createHash("md5").update(JSON.stringify(params)).digest("hex")}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const result = JSON.parse(cached);
      // An expiring job must never be returned merely because Redis still has it.
      if (Array.isArray(result.jobs) && result.jobs.every((job: { applicationDeadline?: string }) =>
        job.applicationDeadline && new Date(job.applicationDeadline).getTime() >= Date.now())) {
        return result;
      }
    }
  } catch (error) {
    console.error("Redis Read Error:", error);
  }

  // Build Query Conditions
  const filterConditions: any[] = [{ isActive: true, isDeleted: { $ne: true }, applicationDeadline: { $gte: new Date() } }];

  if (searchTerm) {
    const searchRegex = { $regex: escapeRegex(searchTerm), $options: "i" };
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
    filterConditions.push({ location: { $regex: escapeRegex(location), $options: "i" } });

  if (minSalary !== undefined) filterConditions.push({ salaryMax: { $gte: minSalary } });
  if (maxSalary !== undefined) filterConditions.push({ salaryMin: { $lte: maxSalary } });

  if (salaryRanges) {
    const ranges = salaryRanges.split(",").slice(0, 10).map((r) => {
      const [minStr, maxStr] = r.split("-");
      const min = parseFloat(minStr);
      const max = maxStr === "Infinity" ? Infinity : parseFloat(maxStr);
      const cond: any = {};
      if (!Number.isFinite(min) || Number.isNaN(max)) throw new Error("Invalid salary range");
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
      const recruiters = await Company.distinct("userId", { companySize: { $in: sizes } });
      filterConditions.push({ author: { $in: recruiters } });
    }
  }

  const filter = { $and: filterConditions };
  const safePage = Math.min(Math.max(Number(page) || 1, 1), 10000);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  // Execute concurrently
  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .select(
        "_id author title category subcategory type location locationType salaryMin salaryMax salaryPeriod experienceLevel description skills applicationDeadline createdAt isActive positions",
      )
      .populate("company", "companyName companyLogo companySize")
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean({ virtuals: true }),
    Job.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / safeLimit);
  const result = {
    jobs,
    pagination: {
      currentPage: safePage,
      totalPages,
      totalJobs: total,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };

  try {
    const earliestDeadline = Math.min(...jobs.map((job) => new Date(job.applicationDeadline).getTime()));
    const remaining = Number.isFinite(earliestDeadline) ? Math.floor((earliestDeadline - Date.now()) / 1000) : 60;
    // Bound cache lifetime by the nearest expiring result; a zero lifetime is not cached.
    if (remaining > 0) await redis.setex(cacheKey, Math.min(60, remaining), JSON.stringify(result));
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
