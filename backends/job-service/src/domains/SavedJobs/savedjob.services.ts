import SavedJob from "./savedjob.model";
import { ISavedJob } from "./savedjob.model";
import Job from "../Jobs/job.model";
import redis from "../../config/redis";
import crypto from "crypto";

// Save a job for a user
const saveJob = async (userId: string, jobId: string) => {
  // Check if the job already exists in user's saved jobs
  const existingSavedJob = await SavedJob.findOne({ userId, jobId });
  if (existingSavedJob) {
    throw new Error("Job is already saved by this user");
  }

  // Verify that the job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  const savedJob = new SavedJob({ userId, jobId });
  const result = await savedJob.save();

  // Clear user's saved jobs cache
  await clearUserSavedJobsCache(userId);

  return result;
};

// Get all saved jobs for a user
const getUserSavedJobs = async (userId: string) => {
  const cacheKey = `userSavedJobs:${userId}`;

  try {
    // Try to get cached result
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      console.log("Cache hit for getUserSavedJobs");
      return JSON.parse(cachedResult);
    }
  } catch (error) {
    console.log("Error fetching from Redis cache:", error);
    // Continue with database query if cache fails
  }

  const savedJobs = await SavedJob.find({ userId })
    .populate({
      path: 'jobId',
      model: 'Job'
    }) // Populate the actual job data
    .sort({ createdAt: -1 }); // Sort by most recently saved

  try {
    // Store the result in Redis with an expiration time (300 seconds = 5 minutes)
    await redis.setex(cacheKey, 300, JSON.stringify(savedJobs));
  } catch (error) {
    console.log("Error storing to Redis cache:", error);
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
    const cacheKey = `userSavedJobs:${userId}`;
    await redis.del(cacheKey);
    console.log(`Cleared cache for user saved jobs: ${userId}`);
  } catch (error) {
    console.log("Error clearing user saved jobs cache:", error);
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
