import { z } from "zod";
import { passwordSchema } from "../Auth/auth.validation";
export const updateProfileValidation = z.object({
  name: z.string().trim().min(3).max(100).optional(),
  phoneNumber: z.string().trim().min(10).max(24).optional(),
  image: z.url().max(2048).optional(),
}).strict();
export const changePasswordValidation = z.object({
  oldPassword: z.string().min(1).optional(),
  currentPassword: z.string().min(1).optional(),
  newPassword: passwordSchema,
}).refine((data) => !!(data.oldPassword || data.currentPassword), { message: "Current password required" });
export const deleteProfileValidation = z.object({ password: z.string().min(1) });
export default { updateProfileValidation, changePasswordValidation, deleteProfileValidation };
