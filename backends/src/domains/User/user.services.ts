import { AppError } from "../../lib/errors";
import User from "./user.model";
import httpStatus from "http-status";

const getAllUsers = async () => {
  return await User.find();
};

const userDetails = async (userId: string) => {
  return await User.findById(userId).select(
    "email name phoneNumber role image isEmailVerified",
  );
};

const updateUser = async (userId: string, data: any) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  Object.assign(user, data);
  await user.save();
  return user;
};

const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const isPasswordValid = await user.isPasswordMatch(oldPassword);
  if (!isPasswordValid) {
    throw new AppError("Old password is incorrect", httpStatus.BAD_REQUEST);
  }

  user.password = newPassword;
  await user.save();
  return user;
};

const deleteProfile = async (userId: string, password: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const isPasswordValid = await user.isPasswordMatch(password);
  if (!isPasswordValid) {
    throw new AppError("Password is incorrect", httpStatus.BAD_REQUEST);
  }

  await User.findByIdAndDelete(userId);
  return user;
};

export default { getAllUsers, userDetails, updateUser, changePassword, deleteProfile };
