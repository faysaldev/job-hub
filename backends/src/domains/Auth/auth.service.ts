import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { sendEmail } from "../../lib/mail.service";
import { AppError } from "../../lib/errors";
import User, { IAMUser } from "../User/user.model";
import { issueSession, revokeAllSessions } from "./auth.token.services";
import Job from "../Jobs/job.model";
import jobService from "../Jobs/job.services";

const emailKey = (email: string) => email.trim().toLowerCase();
const codeHash = (purpose: string, email: string, code: number | string) =>
  createHash("sha256").update(`${purpose}:${emailKey(email)}:${code}:${process.env.JWT_SECRET}`).digest("hex");
const codeMatches = (stored: string | undefined, computed: string) =>
  typeof stored === "string" && /^[a-f0-9]{64}$/i.test(stored) &&
  timingSafeEqual(Buffer.from(stored, "hex"), Buffer.from(computed, "hex"));
const newCode = () => randomInt(100000, 1000000);
const mainFrontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].trim().replace(/\/$/, "");

const account = (user: IAMUser) => ({ _id: user._id, name: user.name, email: user.email,
  phoneNumber: user.phoneNumber, image: user.image, role: user.role,
  isEmailVerified: user.isEmailVerified, createdAt: user.get("createdAt") });

const register = async (input: { name: string; email: string; password: string; phoneNumber: string;
  role: "seeker" | "recruiter" }) => {
  const email = emailKey(input.email);
  const existing = await User.exists({ $or: [{ email }, { phoneNumber: input.phoneNumber }] });
  if (existing) throw new AppError("Email or phone number already registered", 409);
  const code = newCode();
  const user = await User.create({ name: input.name, email, password: input.password,
    phoneNumber: input.phoneNumber, role: input.role,
    verificationCodeHash: codeHash("verification", email, code),
    verificationExpiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  const url = `${mainFrontendUrl()}/verify-email?email=${encodeURIComponent(email)}&code=${code}`;
  await sendEmail(email, "Verify your JobHub account", `Verify your email within 10 minutes: ${url}`);
  return { message: "Verification email sent" };
};

const verifyEmail = async (emailInput: string, code: number) => {
  const email = emailKey(emailInput);
  const user = await User.findOne({ email }).select("+password +verificationCodeHash");
  if (!user || user.isDeleted) throw new AppError("Invalid or expired verification code", 400);
  if (user.isEmailVerified) throw new AppError("Email already verified", 409);
  if (user.verificationAttempts >= 5 || !user.verificationExpiresAt || user.verificationExpiresAt < new Date() ||
      !codeMatches(user.verificationCodeHash, codeHash("verification", email, code))) {
    user.verificationAttempts += 1;
    await user.save();
    throw new AppError("Invalid or expired verification code", 400);
  }
  user.isEmailVerified = true;
  user.verificationCodeHash = undefined;
  user.verificationExpiresAt = undefined;
  user.verificationAttempts = 0;
  user.oneTimeCode = null;
  await user.save();
  const tokens = await issueSession(user);
  return { user: account(user), ...tokens };
};

const loginUser = async (emailInput: string, password: string) => {
  const user = await User.findOne({ email: emailKey(emailInput) }).select("+password");
  if (!user || user.isDeleted || !(await user.isPasswordMatch(password))) {
    throw new AppError("Invalid credentials", 401);
  }
  if (!user.isEmailVerified) throw new AppError("Please verify your email", 403);
  return { user: account(user), ...(await issueSession(user)) };
};

const forgotPassword = async (emailInput: string) => {
  const email = emailKey(emailInput);
  const user = await User.findOne({ email });
  if (user && !user.isDeleted && user.isEmailVerified) {
    const code = newCode();
    user.resetCodeHash = codeHash("reset", email, code);
    user.resetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetAttempts = 0;
    await user.save();
    const url = `${mainFrontendUrl()}/reset-password?email=${encodeURIComponent(email)}&code=${code}`;
    await sendEmail(email, "Reset your JobHub password", `Reset your password within 10 minutes: ${url}`);
  }
  return { message: "If this address is registered, a reset email has been sent" };
};

const resetPassword = async (emailInput: string, code: string, newPassword: string) => {
  const user = await User.findOne({ email: emailKey(emailInput), isDeleted: { $ne: true } })
    .select("+password +resetCodeHash");
  if (!user || user.resetAttempts >= 5 || !user.resetExpiresAt || user.resetExpiresAt < new Date() ||
      !codeMatches(user.resetCodeHash, codeHash("reset", emailInput, code))) {
    if (user) { user.resetAttempts += 1; await user.save(); }
    throw new AppError("Invalid or expired reset code", 400);
  }
  user.password = newPassword;
  user.resetCodeHash = undefined;
  user.resetExpiresAt = undefined;
  user.resetAttempts = 0;
  user.oneTimeCode = null;
  await user.save();
  await revokeAllSessions(user._id.toString());
  return { message: "Password successfully reset. Please sign in again." };
};

const resendVerificationEmail = async (emailInput: string) => {
  const email = emailKey(emailInput);
  const user = await User.findOne({ email });
  if (user && !user.isDeleted && !user.isEmailVerified) {
    const code = newCode();
    user.verificationCodeHash = codeHash("verification", email, code);
    user.verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.verificationAttempts = 0;
    await user.save();
    const url = `${mainFrontendUrl()}/verify-email?email=${encodeURIComponent(email)}&code=${code}`;
    await sendEmail(email, "Verify your JobHub account", `Verify within 10 minutes: ${url}`);
  }
  return { message: "If verification is pending, another email has been sent" };
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(userId, { $set: { isDeleted: true } }, { new: true });
  if (!user) throw new AppError("User not found", 404);
  await revokeAllSessions(userId);
  await Job.updateMany({ author: userId }, { $set: { isActive: false } });
  await jobService.clearJobCache();
  return { message: "Account disabled" };
};
export default { register, verifyEmail, loginUser, forgotPassword, resetPassword, resendVerificationEmail, deleteUser };
