import { z } from "zod";

// Custom password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

export const registerValidation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: passwordSchema,
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.enum(["user", "seeker", "recruiter", "admin"], {
    message: "Role must be user, seeker, recruiter, or admin",
  }),
});

export const verificationValidation = z.object({
  code: z.number({ message: "Verification code is required" }),
  email: z.string().email("Invalid email format"),
});

export const loginValidation = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  fcmToken: z.string().optional(),
});

export const forgotPasswordValidation = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordValidation = z.object({
  code: z.string().length(6, "Code must be exactly 6 characters"),
  email: z.string().email("Invalid email format"),
  newPassword: passwordSchema,
});

export const resendVerificationValidation = z.object({
  email: z.string().email("Invalid email format"),
});

// Type exports for use in services/controllers
export type RegisterInput = z.infer<typeof registerValidation>;
export type VerificationInput = z.infer<typeof verificationValidation>;
export type LoginInput = z.infer<typeof loginValidation>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordValidation>;
export type ResetPasswordInput = z.infer<typeof resetPasswordValidation>;
export type ResendVerificationInput = z.infer<typeof resendVerificationValidation>;

const authValidator = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  resendVerificationValidation,
  verificationValidation,
};

export default authValidator;
