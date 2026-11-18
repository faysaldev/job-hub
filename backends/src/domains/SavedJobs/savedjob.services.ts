import SavedJob from "./savedjob.model";
import Job from "../Jobs/job.model";
import redis from "../../config/redis";
import { assertId } from "../../lib/query";
import { publicJobFilter } from "../Jobs/job.lifecycle";
import { AppError } from "../../lib/errors";

// Idempotent bookmark mutation: a retry or a second browser tab cannot create duplicates.
const saveJob = async (userId: string, jobId: string) => {
  assertId(jobId, "job ID");
  const jobExists = await Job.exists({ _id: jobId, ...publicJobFilter() });
  if (!jobExists) throw new AppError("This job is no longer available to save", 404);
  let result;
  try {
    result = await SavedJob.findOneAndUpdate({ userId, jobId },
      { $setOnInsert: { userId, jobId } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  } catch (error: any) {
    if (error?.code !== 11000) throw error;
    // The unique (userId, jobId) index may win in another request.
    result = await SavedJob.findOne({ userId, jobId });
    if (!result) throw error;
  }
  await clearUserSavedJobsCache(userId);
  return result;
};

// Get all saved jobs for a user
const getUserSavedJobs = async (userId: string) => {
  let version = "1";
  try { version = (await redis.get("jobhub:search:version")) || version; } catch { /* DB remains source of truth */ }
  const cacheKey = `userSavedJobs:${userId}:v${version}`;

  try {
    // Try to get cached result
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      const rows = JSON.parse(cachedResult);
      if (Array.isArray(rows) && rows.every((item: { jobId?: { isActive?: boolean; isDeleted?: boolean; applicationDeadline?: string } }) =>
        item.jobId?.isActive !== false && item.jobId?.isDeleted !== true &&
        (!item.jobId?.applicationDeadline || new Date(item.jobId.applicationDeadline).getTime() >= Date.now()))) return rows;
    }
  } catch (error) {
    console.warn("Saved jobs cache read unavailable; querying MongoDB");
    // Continue with database query if cache fails
  }

  const savedJobs = await SavedJob.find({ userId })
    .populate({
      path: "jobId",
      model: "Job",
      select: "-responsibilities -benefits -requirements",
      populate: [{ path: "company", select: "companyName companyLogo" }],
    }) // Populate the actual job data and nested company, excluding unwanted fields
    .sort({ createdAt: -1 }); // Sort by most recently saved

  try {
    // Store the result in Redis with an expiration time (300 seconds = 5 minutes)
    await redis.setex(cacheKey, 60, JSON.stringify(savedJobs));
  } catch (error) {
    console.warn("Saved jobs cache write unavailable");
    // Continue anyway even if caching fails
  }

  return savedJobs;
};

// Delete a saved job for a user
const deleteSavedJob = async (userId: string, jobId: string) => {
  const result = await SavedJob.findOneAndDelete({ userId, jobId });

  if (result) {
    // Clear user's saved jobs cache
    await clearUserSavedJobsCache(userId);
  }

  return result;
};

// Check if a job is saved by a user
const isJobSavedByUser = async (userId: string, jobId: string) => {
  const savedJob = await SavedJob.findOne({ userId, jobId });
  return !!savedJob;
};

// Clear user's saved jobs cache
const clearUserSavedJobsCache = async (userId: string) => {
  try {
    const version = (await redis.get("jobhub:search:version")) || "1";
    await redis.del(`userSavedJobs:${userId}:v${version}`);
  } catch (error) {
    console.warn("Saved jobs cache invalidation unavailable");
  }
};

const savedJobService = {
  saveJob,
  getUserSavedJobs,
  deleteSavedJob,
  isJobSavedByUser,
  clearUserSavedJobsCache,
};

export default savedJobService;
