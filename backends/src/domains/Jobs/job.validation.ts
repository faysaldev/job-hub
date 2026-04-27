import { z } from "zod";

const jobTypeSchema = z.enum(["full-time", "part-time", "contract", "internship", "freelance"]);
const locationTypeSchema = z.enum(["remote", "onsite", "hybrid"]);
const salaryPeriodSchema = z.enum(["hourly", "daily", "weekly", "monthly", "yearly"]);
const experienceLevelSchema = z.enum(["junior", "mid", "senior", "lead"]);

export const createJobValidation = z.object({
  title: z.string().min(1, "Job title is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  type: jobTypeSchema,
  location: z.string().min(1, "Location is required"),
  locationType: locationTypeSchema,
  salaryMin: z.string().transform((val) => parseInt(val)).pipe(z.number().min(0, "Minimum salary must be positive")),
  salaryMax: z.string().transform((val) => parseInt(val)).pipe(z.number().min(0, "Maximum salary must be positive")),
  salaryPeriod: salaryPeriodSchema,
  experienceLevel: experienceLevelSchema,
  description: z.string().min(1, "Description is required"),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  responsibilities: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  applicationDeadline: z.string().transform((val) => new Date(val)).pipe(z.date()),
  positions: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1, "At least one position is required")),
}).refine((data) => data.salaryMin <= data.salaryMax, {
  message: "Minimum salary cannot be greater than maximum salary",
  path: ["salaryMin"],
});

export const updateJobValidation = z.object({
  title: z.string().min(1, "Job title is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  subcategory: z.string().min(1, "Subcategory is required").optional(),
  type: jobTypeSchema.optional(),
  location: z.string().min(1, "Location is required").optional(),
  locationType: locationTypeSchema.optional(),
  salaryMin: z.string().transform((val) => parseInt(val)).pipe(z.number().min(0, "Minimum salary must be positive")).optional(),
  salaryMax: z.string().transform((val) => parseInt(val)).pipe(z.number().min(0, "Maximum salary must be positive")).optional(),
  salaryPeriod: salaryPeriodSchema.optional(),
  experienceLevel: experienceLevelSchema.optional(),
  description: z.string().min(1, "Description is required").optional(),
  requirements: z.array(z.string()).min(1, "At least one requirement is required").optional(),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required").optional(),
  applicationDeadline: z.string().transform((val) => new Date(val)).pipe(z.date()).optional(),
  positions: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1, "At least one position is required")).optional(),
  isActive: z.boolean().optional(),
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
  q: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  type: jobTypeSchema.optional(),
  location: z.string().optional(),
  locationType: locationTypeSchema.optional(),
  experienceLevel: experienceLevelSchema.optional(),
  minSalary: z.string().transform((val) => parseInt(val)).pipe(z.number().min(0)).optional(),
  maxSalary: z.string().transform((val) => parseInt(val)).pipe(z.number().min(0)).optional(),
  page: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1)).default(1),
  limit: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1).max(100)).default(10),
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
