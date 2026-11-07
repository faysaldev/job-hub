import { z } from "zod";

export const createCompanyValidation = z.object({
  companyName: z.string().optional(),
  industries: z.string().optional(),
  companySize: z.string().optional(),
  companyLocation: z.string().optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional(),
  companyLogo: z.string().max(2048).refine((value) => {
    if (!value) return true;
    try { const url = new URL(value); return url.protocol === "https:" && !!url.hostname; }
    catch { return false; }
  }, "Logo must have an HTTPS URL").optional(),
});

export const updateCompanyValidation = z.object({
  companyName: z.string().optional(),
  industries: z.string().optional(),
  companySize: z.string().optional(),
  companyLocation: z.string().optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional(),
  companyLogo: z.string().max(2048).refine((value) => {
    if (!value) return true;
    try { const url = new URL(value); return url.protocol === "https:" && !!url.hostname; }
    catch { return false; }
  }, "Logo must have an HTTPS URL").optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanyValidation>;
export type UpdateCompanyInput = z.infer<typeof updateCompanyValidation>;

const companyValidator = {
  createCompanyValidation,
  updateCompanyValidation,
};

export default companyValidator;
