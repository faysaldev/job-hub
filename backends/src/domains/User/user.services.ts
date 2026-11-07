import { AppError } from "../../lib/errors";
import { revokeAllSessions } from "../Auth/auth.token.services";
import User from "./user.model";
import { assertOwnedPublicImage } from "../Asset/asset.services";
import Job from "../Jobs/job.model";
import jobService from "../Jobs/job.services";
import { updateProfileValidation } from "./user.validation";

const getAllUsers = async () => User.find({ isDeleted: { $ne: true } }).select("name role image").lean();
const userDetails = async (userId: string) => User.findOne({ _id: userId, isDeleted: { $ne: true } })
  .select("email name phoneNumber role image isEmailVerified").lean();
const updateUser = async (userId: string, data: unknown) => {
  const parsed = updateProfileValidation.parse(data);
  if (parsed.image) await assertOwnedPublicImage(parsed.image, userId, "avatar");
  const user = await User.findOneAndUpdate({ _id: userId, isDeleted: { $ne: true } },
    { $set: parsed }, { new: true, runValidators: true });
  if (!user) throw new AppError("User not found", 404);
  return userDetails(userId);
};
const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select("+password");
  if (!user || user.isDeleted) throw new AppError("User not found", 404);
  if (!(await user.isPasswordMatch(oldPassword))) throw new AppError("Incorrect password", 400);
  user.password = newPassword;
  await user.save();
  await revokeAllSessions(userId);
  return {};
};
const deleteProfile = async (userId: string, password: string) => {
  const user = await User.findById(userId).select("+password");
  if (!user || user.isDeleted) throw new AppError("User not found", 404);
  if (!(await user.isPasswordMatch(password))) throw new AppError("Incorrect password", 400);
  user.isDeleted = true;
  await user.save(); // soft-delete: preserve referential integrity
  await revokeAllSessions(userId);
  await Job.updateMany({ author: userId }, { $set: { isActive: false } });
  await jobService.clearJobCache();
  return {};
};
export default { getAllUsers, userDetails, updateUser, changePassword, deleteProfile };
