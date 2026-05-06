import mongoose from "mongoose";
import Job from "../Jobs/job.model";
import Notification from "../Notifications/notifications.model";
import SavedJob from "../SavedJobs/savedjob.model";
import Application from "../Applications/application.model";

// Simple in-memory cache
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const getHeaderStats = async (userId: string) => {
  const [unreadNotificationsCount, savedJobsCount] = await Promise.all([
    Notification.countDocuments({ receiver: userId, isRead: false, isDeleted: false }),
    SavedJob.countDocuments({ userId }),
  ]);

  return {
    unreadNotificationsCount,
    savedJobsCount,
  };
};

const getCategoryStats = async () => {
  const cacheKey = "category_stats";
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  const stats = await Job.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        category: "$_id",
        count: 1,
        _id: 0,
      },
    },
    { $sort: { count: -1 } },
  ]);

  cache[cacheKey] = { data: stats, timestamp: now };
  return stats;
};

const getSubcategoryStats = async () => {
  const cacheKey = "subcategory_stats";
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  const stats = await Job.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$subcategory",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        subcategory: "$_id",
        count: 1,
        _id: 0,
      },
    },
    { $sort: { count: -1 } },
  ]);

  cache[cacheKey] = { data: stats, timestamp: now };
  return stats;
};

const getTopJobs = async () => {
  // Find jobs with most applications
  const topJobIds = await Application.aggregate([
    {
      $group: {
        _id: "$job_id",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  let jobs;

  if (topJobIds.length > 0) {
    const ids = topJobIds.map((item) => item._id);
    jobs = await Job.find({ _id: { $in: ids }, isActive: true })
      .populate({
        path: "company",
        select: "companyLogo companyName",
      })
      .select(
        "title type author createdAt salaryMin salaryMax location locationType",
      )
      .lean();
  }

  // If no applications or fewer than 6, fallback to latest jobs
  if (!jobs || jobs.length < 6) {
    jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "company",
        select: "companyLogo companyName",
      })
      .select(
        "title type author createdAt salaryMin salaryMax location locationType",
      )
      .lean();
  }

  return jobs;
};

const generalService = {
  getHeaderStats,
  getCategoryStats,
  getSubcategoryStats,
  getTopJobs,
};

export default generalService;
