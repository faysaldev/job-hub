import { z } from "zod";
import { AppError } from "../../lib/errors";

const jobType = z.enum(["full-time", "part-time", "contract", "internship", "freelance"]);
const locationType = z.enum(["remote", "onsite", "hybrid"]);
const salaryPeriod = z.enum(["hourly", "daily", "weekly", "monthly", "yearly"]);
const experienceLevel = z.enum(["entry", "junior", "mid", "senior", "lead"]);
const status = z.enum(["draft", "scheduled", "published", "closed"]);
const text = (max = 300) => z.string().trim().min(1, "Cannot be empty").max(max);
const strings = (max = 80, size = 300) => z.array(text(size)).max(max);
const numeric = (minimum: number) => z.preprocess(
  value => value === "" || value === null ? undefined : value,
  z.coerce.number().finite().min(minimum));
const optionalNumber = (minimum: number) => z.preprocess(
  value => value === "" || value === null ? undefined : value,
  z.coerce.number().finite().min(minimum).optional());
const optionalDate = z.preprocess(value => value === "" || value === null ? undefined : value,
  z.coerce.date().optional());

/** All create and update calls use one plain object, not a Zod union with opaque errors. */
const fields = z.object({
  title: text(140),
  category: text(120).optional(),
  subcategory: text(120).optional(),
  type: jobType.optional(),
  location: text(180).optional(),
  locationType: locationType.optional(),
  salaryMin: optionalNumber(0),
  salaryMax: optionalNumber(0),
  salaryPeriod: salaryPeriod.optional(),
  experienceLevel: experienceLevel.optional(),
  description: text(10000).optional(),
  bannerUrl: z.union([z.string().url().startsWith("https://").max(2048), z.literal("")]).optional(),
  requirements: strings().optional(),
  responsibilities: strings().optional(),
  benefits: strings().optional(),
  skills: strings(80, 100).optional(),
  applicationDeadline: optionalDate,
  positions: z.preprocess(value => value === "" || value === null ? undefined : value,
    z.coerce.number().int().min(1).optional()),
  publishAt: optionalDate.nullable().optional(),
  status: status.optional(),
  // Kept for older clients. The service always derives this from lifecycle status.
  isActive: z.boolean().optional(),
});

export const createJobValidation = fields.safeExtend({ title: text(140), status: status.default("published") });
export const updateJobValidation = fields.partial();

const full = z.object({
  title: text(140), category: text(120), subcategory: text(120), type: jobType,
  location: text(180), locationType, salaryMin: numeric(0), salaryMax: numeric(0),
  salaryPeriod, experienceLevel, description: text(10000),
  requirements: strings().min(1, "Add at least one requirement"),
  responsibilities: strings().optional().default([]), benefits: strings().optional().default([]),
  skills: strings(80, 100).min(1, "Add at least one skill"),
  applicationDeadline: z.coerce.date(), positions: numeric(1).pipe(z.number().int()),
}).superRefine((job, context) => {
  if (job.salaryMin > job.salaryMax) context.addIssue({ code: "custom", path: ["salaryMax"], message: "Maximum salary must be at least the minimum" });
});

/** Check a fully merged record, not just fields sent by the edit form. */
export const assertPublishableJob = (job: Record<string, any>, now = new Date()) => {
  const parsed = full.safeParse(job);
  if (!parsed.success) {
    throw new AppError("Correct the highlighted job fields", 422, true,
      parsed.error.issues.map(issue => ({ field: issue.path.join(".") || "job", message: issue.message })));
  }
  const issues: Array<{ field: string; message: string }> = [];
  const deadline = parsed.data.applicationDeadline;
  if (deadline.getTime() <= now.getTime())
    issues.push({ field: "applicationDeadline", message: "Choose a deadline in the future" });
  if (job.status === "scheduled") {
    const publishAt = job.publishAt ? new Date(job.publishAt) : null;
    if (!publishAt || !Number.isFinite(publishAt.getTime()) || publishAt <= now)
      issues.push({ field: "publishAt", message: "Choose a future publication time" });
    else if (publishAt >= deadline)
      issues.push({ field: "publishAt", message: "Publication must happen before the application deadline" });
  }
  if (issues.length) throw new AppError("Correct the highlighted job fields", 422, true, issues);
};

export const validateCompleteJob = (candidate: Record<string, unknown>) => full.safeParse(candidate).success;

export const searchJobsValidation = z.object({
  search: z.string().max(120).optional(), q: z.string().max(120).optional(),
  category: z.string().max(120).optional(), subcategory: z.string().max(120).optional(),
  type: z.string().max(150).optional(), location: z.string().max(120).optional(),
  locationType: locationType.optional(), experienceLevel: z.string().max(150).optional(),
  minSalary: numeric(0).optional(), maxSalary: numeric(0).optional(),
  salaryRanges: z.string().max(300).optional(), companySizes: z.string().max(200).optional(), applicantCounts: z.string().max(150).optional(),
  postedDate: z.enum(["today", "3days", "week", "2weeks", "month", "anytime"]).optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
}).refine(q => q.minSalary === undefined || q.maxSalary === undefined || q.minSalary <= q.maxSalary,
  { path: ["minSalary"], message: "Minimum salary cannot be greater than maximum" });

export type CreateJobInput = z.infer<typeof createJobValidation>;
export type UpdateJobInput = z.infer<typeof updateJobValidation>;
export type SearchJobsInput = z.infer<typeof searchJobsValidation>;
export default { createJobValidation, updateJobValidation, searchJobsValidation };
