import { z } from "zod";

export const contactFormValidation = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  email: z.string().email("Please provide a valid email address").max(254),
  department: z.string().trim().min(1, "Department is required").max(100),
  subject: z.string().trim().min(1, "Subject is required").max(180),
  message: z.string().trim().min(10, "Message must be at least 10 characters long").max(10000),
});

const generalValidation = {
  contactFormValidation,
};

export default generalValidation;
