import { z } from "zod";

const jobTypeSchema = z.enum(["full-time", "part-time", "contract", "internship", "freelance"]);
const locationTypeSchema = z.enum(["remote", "onsite", "hybrid"]);
const salaryPeriodSchema = z.enum(["hourly", "daily", "weekly", "monthly", "yearly"]);
const experienceLevelSchema = z.enum(["entry", "junior", "mid", "senior", "lead"]);

const requiredJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  type: jobTypeSchema,
  location: z.string().min(1, "Location is required"),
  locationType: locationTypeSchema,
  salaryMin: z.coerce.number().finite().min(0, "Minimum salary must be positive"),
  salaryMax: z.coerce.number().finite().min(0, "Maximum salary must be positive"),
  salaryPeriod: salaryPeriodSchema,
  experienceLevel: experienceLevelSchema,
  description: z.string().min(1, "Description is required"),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  responsibilities: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  applicationDeadline: z.coerce.date(),
  positions: z.coerce.number().int().min(1, "At least one position is required"),
}).refine((data) => data.salaryMin <= data.salaryMax, {
  message: "Minimum salary cannot be greater than maximum salary",
  path: ["salaryMin"],
});

// Drafts retain partially completed fields without requiring a publish-ready record.
const draftJobSchema = z.object({
  status: z.literal("draft"), title: z.string().trim().min(1).max(140),
  category: z.string().max(120).optional(), subcategory: z.string().max(120).optional(),
  type: jobTypeSchema.optional(), location: z.string().max(180).optional(),
  locationType: locationTypeSchema.optional(),
  salaryMin: z.number().finite().nonnegative().optional(), salaryMax: z.number().finite().nonnegative().optional(),
  salaryPeriod: salaryPeriodSchema.optional(), experienceLevel: experienceLevelSchema.optional(),
  description: z.string().max(10000).optional(),
  requirements: z.array(z.string().max(300)).max(80).optional(),
  responsibilities: z.array(z.string().max(300)).max(80).optional(),
  benefits: z.array(z.string().max(300)).max(80).optional(),
  skills: z.array(z.string().max(100)).max(80).optional(),
  positions: z.number().int().min(1).optional(), applicationDeadline: z.coerce.date().optional(),
});
export const createJobValidation = z.union([
  requiredJobSchema.safeExtend({ status: z.enum(["published", "scheduled"]).optional(), publishAt: z.coerce.date().optional() }),
  draftJobSchema,
]);

export const updateJobValidation = z.object({
  title: z.string().min(1, "Job title is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  subcategory: z.string().min(1, "Subcategory is required").optional(),
  type: jobTypeSchema.optional(),
  location: z.string().min(1, "Location is required").optional(),
  locationType: locationTypeSchema.optional(),
  salaryMin: z.coerce.number().finite().min(0, "Minimum salary must be positive").optional(),
  salaryMax: z.coerce.number().finite().min(0, "Maximum salary must be positive").optional(),
  salaryPeriod: salaryPeriodSchema.optional(),
  experienceLevel: experienceLevelSchema.optional(),
  description: z.string().min(1, "Description is required").optional(),
  requirements: z.array(z.string()).min(1, "At least one requirement is required").optional(),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required").optional(),
  applicationDeadline: z.coerce.date().optional(),
  positions: z.coerce.number().int().min(1, "At least one position is required").optional(),
  isActive: z.boolean().optional(),
  status: z.enum(["draft", "scheduled", "published", "closed"]).optional(),
  publishAt: z.coerce.date().nullable().optional(),
}).refine((data) => {
  if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
    return data.salaryMin <= data.salaryMax;
  }
  return true;
}, {
  message: "Minimum salary cannot be greater than maximum salary",
  path: ["salaryMin"],
});

export const searchJobsValidation = z.object({
  search: z.string().optional(),
  q: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  locationType: locationTypeSchema.optional(),
  experienceLevel: z.string().optional(),
  minSalary: z.coerce.number().finite().min(0).optional(),
  maxSalary: z.coerce.number().finite().min(0).optional(),
  salaryRanges: z.string().optional(),
  companySizes: z.string().optional(),
  postedDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
}).refine((data) => {
  if (data.minSalary !== undefined && data.maxSalary !== undefined) {
    return data.minSalary <= data.maxSalary;
  }
  return true;
}, {
  message: "Minimum salary cannot be greater than maximum salary",
  path: ["minSalary"],
});

export type CreateJobInput = z.infer<typeof createJobValidation>;
export type UpdateJobInput = z.infer<typeof updateJobValidation>;
export type SearchJobsInput = z.infer<typeof searchJobsValidation>;

const jobValidator = {
  createJobValidation,
  updateJobValidation,
  searchJobsValidation,
};

export default jobValidator;

/** Re-check the *merged* document when a draft becomes publishable. */
export const validateCompleteJob = (candidate: Record<string, unknown>) =>
  requiredJobSchema.safeParse(candidate).success;
