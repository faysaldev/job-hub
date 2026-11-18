import mongoose from "mongoose";
import { companyForActor } from "../Company/company.access";
import { getUsage, currentEntitlement } from "../Billing/billing.entitlements";
import { jobOwnerFilter, publicJobFilter } from "../Jobs/job.lifecycle";
import Interview from "../Interviews/interviews.model";
import Job from "../Jobs/job.model";
import Notification from "../Notifications/notifications.model";
import SavedJob from "../SavedJobs/savedjob.model";
import Application from "../Applications/application.model";
import Seeker from "../Seeker/seeker.model";
import Contact, { IContact } from "./contact.model";

const getHeaderStats = async (userId: string) => {
  const [unreadNotificationsCount, savedJobsCount] = await Promise.all([
    Notification.countDocuments({
      receiver: userId,
      isRead: false,
      isDeleted: false,
    }),
    SavedJob.countDocuments({ userId }),
  ]);

  return {
    unreadNotificationsCount,
    savedJobsCount,
  };
};

/** Use the same public eligibility policy as /job and careers. Never cache
 * aggregate counts independently of the job mutation version. */
const getCategoryStats = async () => Job.aggregate([
  { $match: publicJobFilter() },
  { $match: { category: { $type: "string", $ne: "" } } },
  { $group: { _id: "$category", count: { $sum: 1 } } },
  { $project: { _id: 0, category: "$_id", count: 1 } },
  { $sort: { count: -1 } },
]);
const getSubcategoryStats = async () => Job.aggregate([
  { $match: publicJobFilter() },
  { $match: { subcategory: { $type: "string", $ne: "" } } },
  { $group: { _id: "$subcategory", count: { $sum: 1 } } },
  { $project: { _id: 0, subcategory: "$_id", count: 1 } },
  { $sort: { count: -1 } },
]);

/** Homepage: same first six jobs and sponsored ordering as /job. */
const getDiscoveryJobs = async () => {
  const now = new Date();
  return Job.aggregate([
    { $match: publicJobFilter(now) },
    { $addFields: { isSponsored: { $gt: ["$sponsoredUntil", now] } } },
    { $sort: { isSponsored: -1, createdAt: -1, _id: -1 } }, { $limit: 6 },
    { $project: { author: 1, title: 1, type: 1, location: 1, locationType: 1,
      salaryMin: 1, salaryMax: 1, salaryPeriod: 1, applicationDeadline: 1, createdAt: 1, isSponsored: 1, bannerUrl: 1 } },
    { $lookup: { from: "companies", localField: "author", foreignField: "userId", as: "company",
      pipeline: [{ $project: { companyName: 1, companyLogo: 1 } }] } },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
  ]);
};

const getTopJobs = async () => {
  const topJobIds = await Application.aggregate([
    { $match: { isWithdrawn: { $ne: true } } },
    { $group: { _id: "$job_id", count: { $sum: 1 } } },
    { $sort: { count: -1 } }, { $limit: 10 },
  ]);
  const ids = topJobIds.map(item => item._id);
  const eligible = publicJobFilter();
  const jobs = ids.length ? await Job.find({ _id: { $in: ids }, ...eligible })
    .populate("company", "companyLogo companyName")
    .select("title type author createdAt salaryMin salaryMax salaryPeriod location locationType applicationDeadline bannerUrl")
    .lean() : [];
  if (jobs.length >= 6) return jobs;
  return Job.find(eligible).sort({ createdAt: -1, _id: -1 }).limit(10)
    .populate("company", "companyLogo companyName")
    .select("title type author createdAt salaryMin salaryMax salaryPeriod location locationType applicationDeadline bannerUrl")
    .lean();
};

const getSeekerDashboardStats = async (userId: string) => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [seeker, totalApplications, weeklyApplications, hiredApplications] =
    await Promise.all([
      Seeker.findOne({ userId }).select("profileStrength resume").lean(),
      Application.countDocuments({ applicant: userId, isWithdrawn: { $ne: true } }),
      Application.countDocuments({
        applicant: userId, isWithdrawn: { $ne: true },
        createdAt: { $gte: startOfWeek },
      }),
      Application.countDocuments({ applicant: userId, status: "hired", isWithdrawn: { $ne: true } }),
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
  const applications = await Application.find({ applicant: userId, isWithdrawn: { $ne: true } })
    .select("job_id")
    .lean();
  return applications.map((app) => app.job_id.toString());
};

const getSavedJobIds = async (userId: string) => {
  const savedJobs = await SavedJob.find({ userId }).select("jobId").lean();
  return savedJobs.map((savedJob) => savedJob.jobId.toString());
};

const submitContactForm = async (contactData: Partial<IContact>) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

const getRecruiterDashboardStats = async (recruiterId: string) => {
  const { company } = await companyForActor(recruiterId, "view");
  const owner = jobOwnerFilter(company);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400_000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400_000);
  const jobs = await Job.find({ ...owner, isDeleted: { $ne: true } }).select("_id").lean();
  const jobIds = jobs.map(job => job._id);
  const [usage, { entitlement }, recentJobs, previousJobs, totalApplicants, recentApplicants,
    previousApplicants, interviews, salaryStats] = await Promise.all([
    getUsage(company), currentEntitlement(String(company._id)),
    Job.countDocuments({ ...owner, isDeleted: { $ne: true }, createdAt: { $gte: thirtyDaysAgo } }),
    Job.countDocuments({ ...owner, isDeleted: { $ne: true }, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    Application.countDocuments({ job_id: { $in: jobIds }, isWithdrawn: { $ne: true } }),
    Application.countDocuments({ job_id: { $in: jobIds }, isWithdrawn: { $ne: true }, createdAt: { $gte: thirtyDaysAgo } }),
    Application.countDocuments({ job_id: { $in: jobIds }, isWithdrawn: { $ne: true }, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    Interview.countDocuments({ job_id: { $in: jobIds }, status: "scheduled", date: { $gte: now } }),
    Job.aggregate([
      { $match: { ...owner, ...publicJobFilter(now), salaryMin: { $gte: 0 }, salaryMax: { $gte: 0 } } },
      { $group: { _id: null, avgMin: { $avg: "$salaryMin" }, avgMax: { $avg: "$salaryMax" } } },
    ]),
  ]);
  const percentage = (current: number, previous: number) => previous === 0 ?
    (current > 0 ? 100 : 0) : Math.round((current - previous) / previous * 100);
  const avgSalary = salaryStats[0] && Number.isFinite(salaryStats[0].avgMin) && Number.isFinite(salaryStats[0].avgMax) ?
    Math.round((salaryStats[0].avgMin + salaryStats[0].avgMax) / 2) : 0;
  return {
    activeJobs: { total: usage.activeJobs,
      percentage: entitlement.limits.activeJobs ? Math.round(100 * usage.activeJobs / entitlement.limits.activeJobs) : 0 },
    openJobs: usage.openJobs, scheduledJobs: usage.scheduledJobs, publishedJobs: usage.publishedJobs,
    quota: { used: usage.activeJobs, limit: entitlement.limits.activeJobs, overLimit: Math.max(0, usage.activeJobs - entitlement.limits.activeJobs) },
    jobsCreated: { recent: recentJobs, previous: previousJobs },
    applicants: { total: totalApplicants, percentage: percentage(recentApplicants, previousApplicants) },
    interviews: { total: interviews }, avgSalary,
  };
};

export default {
  getHeaderStats,
  getCategoryStats,
  getSubcategoryStats,
  getTopJobs,
  getDiscoveryJobs,
  getSeekerDashboardStats,
  getAppliedJobIds,
  submitContactForm,
  getRecruiterDashboardStats,
  getSavedJobIds,
};
