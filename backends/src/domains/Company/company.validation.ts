import { z } from "zod";

export const createCompanyValidation = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industries: z.string().optional(),
  companySize: z.string().optional(),
  companyLocation: z.string().optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional(),
});

export const updateCompanyValidation = z.object({
  companyName: z.string().min(1, "Company name is required").optional(),
  industries: z.string().optional(),
  companySize: z.string().optional(),
  companyLocation: z.string().optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanyValidation>;
export type UpdateCompanyInput = z.infer<typeof updateCompanyValidation>;

const companyValidator = {
  createCompanyValidation,
  updateCompanyValidation,
};

export default companyValidator;
