import { z } from "zod";

export const contactFormValidation = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please provide a valid email address").min(1, "Email is required"),
  department: z.string().min(1, "Department is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

const generalValidation = {
  contactFormValidation,
};

export default generalValidation;
