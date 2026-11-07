import { z } from "zod";

export const passwordSchema = z.string().min(8).max(128).regex(/[a-zA-Z]/).regex(/\d/);
export const registerValidation = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.email().trim().toLowerCase(),
  password: passwordSchema,
  phoneNumber: z.string().trim().min(10).max(24),
  role: z.enum(["seeker", "recruiter"]), // Never allow self-service admin registration.
}).strict();
export const verificationValidation = z.object({ code: z.coerce.number().int().min(100000).max(999999), email: z.email() });
export const loginValidation = z.object({ email: z.email(), password: z.string().min(1), fcmToken: z.string().optional() });
export const forgotPasswordValidation = z.object({ email: z.email() });
export const resetPasswordValidation = z.object({ code: z.string().regex(/^\d{6}$/), email: z.email(), newPassword: passwordSchema });
export const resendVerificationValidation = z.object({ email: z.email() });
export default { registerValidation, verificationValidation, loginValidation, forgotPasswordValidation,
  resetPasswordValidation, resendVerificationValidation };
