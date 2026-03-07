import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

export const changePasswordValidation = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: passwordSchema,
});

export const deleteProfileValidation = z.object({
  password: z.string().min(1, "Password is required"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordValidation>;
export type DeleteProfileInput = z.infer<typeof deleteProfileValidation>;

const userValidator = {
  changePasswordValidation,
  deleteProfileValidation,
};

export default userValidator;
