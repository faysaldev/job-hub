import mongoose from "mongoose";
import Job from "../Jobs/job.model";
import Notification from "../Notifications/notifications.model";
import SavedJob from "../SavedJobs/savedjob.model";
import Application from "../Applications/application.model";
import Seeker from "../Seeker/seeker.model";
import Contact, { IContact } from "./contact.model";

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

const getSeekerDashboardStats = async (userId: string) => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [seeker, totalApplications, weeklyApplications, hiredApplications] =
    await Promise.all([
      Seeker.findOne({ userId }).select("profileStrength resume").lean(),
      Application.countDocuments({ applicant: userId }),
      Application.countDocuments({
        applicant: userId,
        createdAt: { $gte: startOfWeek },
      }),
      Application.countDocuments({ applicant: userId, status: "hired" }),
    ]);

  // Dynamic import or mongoose.model to avoid circular dependency if any
  const interviewCount = await mongoose
    .model("Interview")
    .countDocuments({ interviewee: userId });

  return {
    profileStrength: seeker?.profileStrength || 0,
    resumeLink: seeker?.resume?.resumeLink || "",
    applications: {
      total: totalApplications,
      thisWeek: weeklyApplications,
      hired: hiredApplications,
    },
    interviews: {
      total: interviewCount,
    },
  };
};

const getAppliedJobIds = async (userId: string) => {
  const applications = await Application.find({ applicant: userId })
    .select("job_id")
    .lean();
  return applications.map((app) => app.job_id.toString());
};

const submitContactForm = async (contactData: Partial<IContact>) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

const getRecruiterDashboardStats = async (recruiterId: string) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recruiterJobs = await Job.find({ author: recruiterId }).select("_id");
  const jobIds = recruiterJobs.map((j) => j._id);

  const [
    activeJobsCount,
    lastMonthJobsCount,
    totalApplicants,
    lastMonthApplicants,
    salaryStats,
  ] = await Promise.all([
    Job.countDocuments({ author: recruiterId, status: "active" }),
    Job.countDocuments({
      author: recruiterId,
      status: "active",
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    }),
    Application.countDocuments({ job_id: { $in: jobIds } }),
    Application.countDocuments({
      job_id: { $in: jobIds },
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    }),
    Job.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(recruiterId) } },
      {
        $group: {
          _id: null,
          avgMin: { $avg: "$salaryMin" },
          avgMax: { $avg: "$salaryMax" },
        },
      },
    ]),
  ]);

  const calculatePercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const avgSalary = salaryStats[0]
    ? Math.round((salaryStats[0].avgMin + salaryStats[0].avgMax) / 2)
    : 0;

  return {
    activeJobs: {
      total: activeJobsCount,
      percentage: calculatePercentage(activeJobsCount, lastMonthJobsCount),
    },
    applicants: {
      total: totalApplicants,
      percentage: calculatePercentage(totalApplicants, lastMonthApplicants),
    },
    avgSalary,
  };
};

const generalService = {
  getHeaderStats,
  getCategoryStats,
  getSubcategoryStats,
  getTopJobs,
  getSeekerDashboardStats,
  getAppliedJobIds,
  submitContactForm,
  getRecruiterDashboardStats,
};

export default generalService;
