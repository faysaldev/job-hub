import crypto from "crypto";
import mongoose from "mongoose";
import Job, { IJob } from "./job.model";
import redis from "../../config/redis";
import { escapeRegex, assertId } from "../../lib/query";
import { companyForActor, jobForActor } from "../Company/company.access";
import { assertPublishableJob } from "./job.validation";
import { assertCompanyBanner } from "../Asset/asset.services";
import { AppError } from "../../lib/errors";
import { requireJobSlot, withCompanyQuotaLock, currentEntitlement, getUsage } from "../Billing/billing.entitlements";
import { jobOwnerFilter, publicJobFilter, quotaJobFilter, reservesJobSlot } from "./job.lifecycle";

const currentSearchVersion = async () => {
  try { return (await redis.get("jobhub:search:version")) || "1"; }
  catch { return String(Date.now()); }
};
const clearJobCache = async (_jobId?: string) => {
  try { await redis.incr("jobhub:search:version"); }
  catch { /* bounded cache lifetime provides a fallback when Redis is unavailable */ }
};

/** Compatibility reader; the searchable /job route uses searchJobs below. */
const getAllJobs = async (filters: Record<string, unknown> = {}) =>
  Job.find({ ...filters, ...publicJobFilter() }).select("-pendingDraft")
    .sort({ createdAt: -1, _id: -1 }).limit(50).lean();

const isWorkspaceJob = (job: IJob, company: { _id: any; userId: any }) =>
  job.companyId ? String(job.companyId) === String(company._id) : String(job.author) === String(company.userId);

const getJobById = async (jobId: string, requesterId?: string) => {
  assertId(jobId);
  if (requesterId) {
    const workspace = await companyForActor(requesterId, "view").catch((error) => {
      if (error instanceof AppError && [403, 404].includes(error.statusCode)) return null;
      throw error;
    });
    if (workspace) {
      const ownJob = await Job.findOne({ _id: jobId, isDeleted: { $ne: true } });
      if (ownJob && isWorkspaceJob(ownJob, workspace.company))
        return ownJob.populate([{ path: "author", select: "name image" }, { path: "company", select: "companyName companyLogo" }]);
    }
  }
  const job = await Job.findOne({ _id: jobId, ...publicJobFilter() }).select("-pendingDraft")
    .populate("author", "name image").populate("company", "companyName companyLogo");
  return job;
};

const getJobsByAuthorId = async (authorId: string, requesterId?: string) => {
  assertId(authorId);
  const workspace = requesterId ? await companyForActor(requesterId, "view").catch(() => null) : null;
  const permitted = String(workspace?.company.userId || "") === authorId;
  return Job.find({ author: authorId, isDeleted: { $ne: true }, ...(permitted ? {} : publicJobFilter()) })
    .select("author companyId title category subcategory type location locationType salaryMin salaryMax salaryPeriod experienceLevel description skills applicationDeadline createdAt isActive responsibilities requirements benefits positions status publishAt bannerUrl")
    .sort({ createdAt: -1, _id: -1 }).lean();
};

const getWorkspaceJobs = async (actorId: string, options: { status?: string; page?: unknown; limit?: unknown } = {}) => {
  const { company } = await companyForActor(actorId, "jobs");
  const page = Math.min(Math.max(Number(options.page) || 1, 1), 10000);
  const limit = Math.min(Math.max(Number(options.limit) || 30, 1), 50);
  const owner = jobOwnerFilter(company);
  const query: Record<string, unknown> = { ...owner, isDeleted: { $ne: true } };
  if (options.status && ["draft", "scheduled", "published", "closed"].includes(options.status))
    query.status = options.status === "published" ? { $in: ["published", null] } : options.status;
  else if (options.status) throw new AppError("Invalid job status", 400);
  const now = new Date();
  const [jobs, total, usage, { entitlement }] = await Promise.all([
    Job.find(query).select("title status isActive publishAt publishedAt applicationDeadline location type createdAt author companyId positions sponsoredUntil pendingDraft moderation.status bannerUrl")
      .sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Job.countDocuments(query), getUsage(company), currentEntitlement(String(company._id)),
  ]);
  return {
    jobs: jobs.map(job => ({ ...job, hasDraftChanges: !!job.pendingDraft,
      pendingDraft: undefined, expired: !!job.applicationDeadline && new Date(job.applicationDeadline).getTime() <= now.getTime() })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    overview: { openJobs: usage.openJobs, scheduledJobs: usage.scheduledJobs,
      publishedJobs: usage.publishedJobs, quotaUsed: usage.activeJobs,
      quotaLimit: entitlement.limits.activeJobs, overLimit: Math.max(0, usage.activeJobs - entitlement.limits.activeJobs) },
  };
};

const createJob = async (data: Partial<IJob>, actorId: string) => {
  const { company } = await companyForActor(actorId, "jobs");
  if (data.bannerUrl) await assertCompanyBanner(data.bannerUrl, String(company._id));
  const status = data.status || "published";
  if (status === "closed") throw new AppError("Create a draft before closing a job", 422, true,
    [{ field: "status", message: "A new job must be draft, scheduled or published" }]);
  const now = new Date();
  const record: Record<string, any> = { ...data, status, author: company.userId, companyId: company._id,
    createdBy: actorId, isActive: status === "published", publishAt: status === "scheduled" ? data.publishAt : undefined,
    ...(status === "published" ? { publishedAt: now } : {}) };
  if (status !== "draft") assertPublishableJob(record, now);
  const saved = reservesJobSlot(record, now)
    ? await withCompanyQuotaLock(String(company._id), async session => {
      await requireJobSlot(company, session);
      const created = await Job.create([record], { session });
      return created[0];
    }) : await Job.create(record);
  await clearJobCache();
  return saved;
};

/** One PATCH-compatible PUT route handles drafts, publication, closure, and edits. */
const updateJob = async (id: string, updateData: Partial<IJob>, actorId: string) => {
  const { company, job } = await jobForActor(id, actorId, "jobs");
  if (updateData.bannerUrl) await assertCompanyBanner(updateData.bannerUrl, String(company._id));
  const updated = await withCompanyQuotaLock(String(company._id), async session => {
    const current = await Job.findOne({ _id: job._id, isDeleted: { $ne: true } }).session(session);
    if (!current) throw new AppError("Job not found", 404);
    const now = new Date();
    const requestedStatus = updateData.status ?? (updateData.isActive !== undefined ?
      (updateData.isActive ? "published" : "closed") : current.status || "published");
    // Editing an already published/scheduled listing must never silently unpublish it.
    // Save a private snapshot for later review; the public job is unchanged.
    if (updateData.status === "draft" && ["published", "scheduled"].includes(current.status)) {
      const existing = current.pendingDraft || {};
      const draft = { ...existing, ...updateData, status: "draft" };
      delete draft.isActive;
      return Job.findOneAndUpdate({ _id: current._id }, { $set: { pendingDraft: draft } },
        { new: true, session, runValidators: true });
    }
    // Publishing a saved private draft also works when the client submits only
    // a status change. Explicit newly submitted form fields win over the draft.
    const change = { ...(requestedStatus === "published" && current.pendingDraft ? current.pendingDraft : {}),
      ...updateData } as Record<string, any>;
    delete change.pendingDraft;
    if (change.publishAt === null || requestedStatus !== "scheduled") delete change.publishAt;
    const next: Record<string, any> = { ...current.toObject(), ...change, status: requestedStatus,
      isActive: requestedStatus === "published" };
    if (current.moderation?.status === "blocked" && ["published", "scheduled"].includes(requestedStatus))
      throw new AppError("This job is blocked by platform moderation", 403);
    if (requestedStatus === "published" && current.status !== "published") next.publishedAt = now;
    if (["published", "scheduled"].includes(requestedStatus)) assertPublishableJob(next, now);
    if (!reservesJobSlot(current.toObject(), now) && reservesJobSlot(next, now))
      await requireJobSlot(company, session);
    const safe = Object.fromEntries(Object.entries({ ...change, status: requestedStatus, isActive: next.isActive,
      ...(next.publishedAt ? { publishedAt: next.publishedAt } : {}) }).filter(([key, value]) =>
      !["author", "companyId", "createdBy", "isDeleted", "_id", "sponsoredUntil", "moderation", "pendingDraft"].includes(key) && value !== undefined));
    return Job.findOneAndUpdate({ _id: current._id, isDeleted: { $ne: true } },
      { $set: safe, $unset: { pendingDraft: "", ...(requestedStatus !== "scheduled" || updateData.publishAt === null ? { publishAt: "" } : {}) } },
      { new: true, runValidators: true, session });
  });
  if (updated) await clearJobCache();
  return updated;
};

const deleteJob = async (id: string, actorId: string) => {
  const { company, job } = await jobForActor(id, actorId, "jobs");
  // Archive is soft-delete, not destructive: applications and history are retained.
  const updated = await withCompanyQuotaLock(String(company._id), session =>
    Job.findOneAndUpdate({ _id: job._id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true, isActive: false, status: "closed" }, $unset: { pendingDraft: "" } },
      { new: true, runValidators: true, session }));
  if (updated) await clearJobCache();
  return updated;
};

/** Run using the existing Phase 4 scheduler, not on user-facing reads. */
const publishDueJobs = async () => {
  const now = new Date();
  const result = await Job.updateMany({ status: "scheduled", isActive: false,
    publishAt: { $lte: now }, applicationDeadline: { $gt: now },
    "moderation.status": { $ne: "blocked" }, isDeleted: { $ne: true } },
    { $set: { status: "published", isActive: true, publishedAt: now }, $unset: { publishAt: "" } });
  if (result.modifiedCount) await clearJobCache();
  return result.modifiedCount;
};

interface SearchJobsParams {
  searchTerm?: string; category?: string; subcategory?: string;
  type?: string; experienceLevel?: string; location?: string;
  locationType?: string; minSalary?: number; maxSalary?: number;
  page?: number; limit?: number; salaryRanges?: string;
  companySizes?: string; postedDate?: string; applicantCounts?: string;
}
const searchJobs = async (options: SearchJobsParams = {}) => {
  const page = Math.min(Math.max(Number(options.page) || 1, 1), 10000);
  const limit = Math.min(Math.max(Number(options.limit) || 10, 1), 50);
  const params = { ...options, page, limit };
  const cacheKey = `jobs:search:v${await currentSearchVersion()}:${crypto.createHash("sha256").update(JSON.stringify(params)).digest("hex")}`;
  try {
    const raw = await redis.get(cacheKey);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached?.pagination && Array.isArray(cached.jobs) && cached.jobs.every((job: { applicationDeadline: string; sponsoredUntil?: string; isSponsored?: boolean }) =>
        new Date(job.applicationDeadline).getTime() > Date.now() &&
        (!job.isSponsored || (job.sponsoredUntil && new Date(job.sponsoredUntil).getTime() > Date.now()))))
        return cached;
    }
  } catch { /* query Mongo when cache is unavailable */ }

  const now = new Date();
  const conditions: Record<string, unknown>[] = [publicJobFilter(now)];
  if (options.searchTerm?.trim()) {
    const regex = { $regex: escapeRegex(options.searchTerm.trim()), $options: "i" };
    conditions.push({ $or: ["title", "category", "subcategory", "description", "requirements", "skills"].map(field => ({ [field]: regex })) });
  }
  if (options.type) conditions.push({ type: { $in: options.type.split(",").map(v => v.trim()).filter(Boolean) } });
  if (options.experienceLevel) conditions.push({ experienceLevel: { $in: options.experienceLevel.split(",").map(v => v.trim()).filter(Boolean) } });
  const locationType = options.locationType || (/^remote$/i.test(options.location?.trim() || "") ? "remote" : undefined);
  if (locationType) conditions.push({ locationType });
  if (options.location?.trim() && !/^remote$/i.test(options.location.trim()))
    conditions.push({ location: { $regex: escapeRegex(options.location.trim()), $options: "i" } });
  if (options.minSalary !== undefined) conditions.push({ salaryMax: { $gte: options.minSalary } });
  if (options.maxSalary !== undefined) conditions.push({ salaryMin: { $lte: options.maxSalary } });
  if (options.salaryRanges) {
    // The existing frontend sends stable range IDs, not raw numerical pairs.
    const choices: Record<string, [number, number]> = {
      "0-30k": [0, 30000], "30k-50k": [30000, 50000],
      "50k-75k": [50000, 75000], "75k-100k": [75000, 100000],
      "100k-150k": [100000, 150000], "150k+": [150000, Infinity],
    };
    const ranges = options.salaryRanges.split(",").slice(0, 6).map(value => {
      const key = value.trim();
      // Accept old numeric min-max filters as well as stable range IDs.
      const legacy = /^(\d{1,10})-(\d{1,10}|Infinity)$/.exec(key);
      const bounds = choices[key] || (legacy ? [Number(legacy[1]),
        legacy[2] === "Infinity" ? Infinity : Number(legacy[2])] as [number, number] : null);
      if (!bounds || !Number.isFinite(bounds[0]) || bounds[1] < bounds[0])
        throw new AppError("Invalid salary range", 400, true,
          [{ field: "salaryRanges", message: `Unsupported salary range: ${value}` }]);
      const [min, max] = bounds;
      return { ...(Number.isFinite(max) ? { salaryMin: { $lte: max } } : {}), salaryMax: { $gte: min } };
    });
    if (ranges.length) conditions.push({ $or: ranges });
  }
  const days: Record<string, number> = { today: 1, "3days": 3, week: 7, "2weeks": 14, month: 30 };
  if (options.postedDate && days[options.postedDate]) conditions.push({ createdAt: { $gte: new Date(now.getTime() - days[options.postedDate] * 86400_000) } });
  if (options.companySizes) {
    const sizes = options.companySizes.split(",").map(s => s.trim()).filter(Boolean);
    const companies = mongoose.model("Company");
    const recruiters = await companies.distinct("userId", { companySize: { $in: sizes } });
    conditions.push({ author: { $in: recruiters } });
  }
  const subset = { ...(options.category ? { category: options.category } : {}),
    ...(options.subcategory ? { subcategory: options.subcategory } : {}) };
  const selectedCategory = options.category ? { category: options.category } : {};
  // One indexed MongoDB read produces rows, total and accurate filters. No new API.
  const applicantRanges: Record<string, [number, number]> = {
    "0-10": [0, 9], "10-50": [10, 49], "50-100": [50, 99], "100+": [100, Infinity],
  };
  const selectedRanges = options.applicantCounts?.split(",").filter(Boolean).map(id => {
    const range = applicantRanges[id];
    if (!range) throw new AppError("Invalid applicant count filter", 400, true,
      [{ field: "applicantCounts", message: `Unsupported range: ${id}` }]);
    return { applicantCount: { $gte: range[0], ...(range[1] === Infinity ? {} : { $lte: range[1] }) } };
  }) || [];
  const applicantFilterPipeline: any[] = selectedRanges.length ? [
    { $lookup: { from: "applications", let: { jobId: "$_id" }, pipeline: [
      { $match: { $expr: { $eq: ["$job_id", "$$jobId"] }, isWithdrawn: { $ne: true } } },
      { $count: "count" },
    ], as: "applicantsAgg" } },
    { $addFields: { applicantCount: { $ifNull: [{ $arrayElemAt: ["$applicantsAgg.count", 0] }, 0] } } },
    { $match: { $or: selectedRanges } },
  ] : [];
  const [facet] = await Job.aggregate([{ $match: { $and: conditions } },
    ...applicantFilterPipeline, { $facet: {
    jobs: [ { $match: subset }, { $addFields: { isSponsored: { $gt: ["$sponsoredUntil", now] } } },
      { $sort: { isSponsored: -1, createdAt: -1, _id: -1 } },
      { $skip: (page - 1) * limit }, { $limit: limit },
      { $project: { _id: 1, author: 1, title: 1, category: 1, subcategory: 1,
        type: 1, location: 1, locationType: 1, salaryMin: 1, salaryMax: 1,
        salaryPeriod: 1, experienceLevel: 1, description: 1, skills: 1,
        applicationDeadline: 1, createdAt: 1, isActive: 1, positions: 1, bannerUrl: 1,
        isSponsored: 1, sponsoredUntil: 1 } },
      { $lookup: { from: "companies", localField: "author", foreignField: "userId", as: "company",
        pipeline: [{ $project: { companyName: 1, companyLogo: 1, companySize: 1 } }] } },
      { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
    ],
    total: [{ $match: subset }, { $count: "count" }],
    categories: [{ $match: { category: { $type: "string", $ne: "" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, category: "$_id", count: 1 } } ],
    subcategories: [{ $match: { ...selectedCategory, subcategory: { $type: "string", $ne: "" } } },
      { $group: { _id: "$subcategory", count: { $sum: 1 } } },
      { $project: { _id: 0, subcategory: "$_id", count: 1 } } ],
  } }]).allowDiskUse(true);
  const jobs = facet?.jobs || [];
  const total = facet?.total?.[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);
  const result = { jobs, pagination: { currentPage: page, totalPages, totalJobs: total,
    hasNext: page < totalPages, hasPrev: page > 1 },
    facets: { categories: facet?.categories || [], subcategories: facet?.subcategories || [] } };
  try {
    const earliest = Math.min(...jobs.map((job: any) => Math.min(new Date(job.applicationDeadline).getTime(),
      job.isSponsored && job.sponsoredUntil ? new Date(job.sponsoredUntil).getTime() : Infinity)));
    const ttl = Number.isFinite(earliest) ? Math.floor((earliest - Date.now()) / 1000) : 30;
    if (ttl > 0) await redis.setex(cacheKey, Math.min(30, ttl), JSON.stringify(result));
  } catch { /* allow public browsing without Redis */ }
  return result;
};

const seedJobs = async (jobs: Partial<IJob>[]) => {
  if (process.env.NODE_ENV !== "test" || process.env.JOBHUB_ALLOW_TEST_SEED !== "true")
    throw new AppError("Destructive demo seeding is disabled outside explicitly approved test environments", 403);
  await Job.deleteMany({});
  const created = await Job.insertMany(jobs);
  await clearJobCache();
  return created;
};

export default { getAllJobs, getJobById, createJob, updateJob, deleteJob, searchJobs,
  seedJobs, clearJobCache, getJobsByAuthorId, getWorkspaceJobs, publishDueJobs };
