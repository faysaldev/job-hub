import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { enqueueAuthEmail } from "../../lib/mail.outbox";
import { AppError } from "../../lib/errors";
import User, { IAMUser } from "../User/user.model";
import { issueSession, revokeAllSessions } from "./auth.token.services";
import Job from "../Jobs/job.model";
import jobService from "../Jobs/job.services";

const CODE_TTL_MS = 10 * 60_000;
const RESEND_COOLDOWN_MS = 60_000;
const MAX_CODE_ATTEMPTS = 5;
const emailKey = (email: string) => email.trim().toLowerCase();
const codeHash = (purpose: string, email: string, code: string | number) =>
  createHash("sha256").update(`${purpose}:${emailKey(email)}:${code}:${process.env.JWT_SECRET}`).digest("hex");
const codeMatches = (stored: string | undefined, computed: string) =>
  typeof stored === "string" && /^[a-f0-9]{64}$/i.test(stored) &&
  timingSafeEqual(Buffer.from(stored, "hex"), Buffer.from(computed, "hex"));
const newCode = () => randomInt(100000, 1000000);
const mainFrontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].trim().replace(/\/$/, "");

const account = (user: IAMUser) => ({ _id: user._id, name: user.name, email: user.email,
  phoneNumber: user.phoneNumber, image: user.image, role: user.role,
  isEmailVerified: user.isEmailVerified, createdAt: user.get("createdAt") });

const scheduleCode = async (user: IAMUser, purpose: "verification" | "password-reset", code: number, expiry: Date) => {
  const verification = purpose === "verification";
  const link = verification
    ? `${mainFrontendUrl()}/verify-email?email=${encodeURIComponent(user.email)}&code=${code}`
    : `${mainFrontendUrl()}/reset-password?email=${encodeURIComponent(user.email)}&code=${code}`;
  await enqueueAuthEmail({ userId: user._id, to: user.email, purpose,
    subject: verification ? "Verify your JobHub account" : "Reset your JobHub password",
    body: `${verification ? "Verify your account" : "Reset your password"} using this link (valid for 10 minutes):\n${link}\n\nIf you did not request this, you can ignore this email.`,
    expiresAt: expiry });
};

const register = async (input: { name: string; email: string; password: string; phoneNumber: string;
  role: "seeker" | "recruiter" }) => {
  const email = emailKey(input.email);
  const existing = await User.findOne({ $or: [{ email }, { phoneNumber: input.phoneNumber }] })
    .select("email isEmailVerified").lean();
  if (existing) {
    if (existing.email === email && !existing.isEmailVerified) {
      throw new AppError("Account awaiting email verification. Use the verification page to resend the link.", 409, true,
        [{ field: "email", message: "This email is awaiting verification" }]);
    }
    throw new AppError("Email or phone number already registered", 409, true,
      [{ field: existing.email === email ? "email" : "phoneNumber", message: "Already in use" }]);
  }
  const code = newCode();
  const expiry = new Date(Date.now() + CODE_TTL_MS);
  const user = await User.create({ name: input.name, email, password: input.password,
    phoneNumber: input.phoneNumber, role: input.role,
    verificationCodeHash: codeHash("verification", email, code),
    verificationExpiresAt: expiry, verificationRequestedAt: new Date() });
  try { await scheduleCode(user, "verification", code, expiry); }
  catch {
    // The account exists; never delete it or lose credentials on a mail outage.
    // Resend can recover it without requiring a duplicate registration.
    await User.updateOne({ _id: user._id }, { $unset: { verificationRequestedAt: "" } });
    throw new AppError("Account created, but email delivery could not be queued. Use Resend verification.", 503);
  }
  return { email, verificationPending: true };
};

const verifyEmail = async (emailInput: string, code: number) => {
  const email = emailKey(emailInput);
  const user = await User.findOne({ email }).select("+verificationCodeHash");
  if (!user || user.isDeleted || user.suspendedAt || user.isEmailVerified) {
    throw new AppError("Invalid or expired verification code", 400);
  }
  if (user.verificationAttempts >= MAX_CODE_ATTEMPTS || !user.verificationExpiresAt ||
    user.verificationExpiresAt < new Date() || !codeMatches(user.verificationCodeHash, codeHash("verification", email, code))) {
    await User.updateOne({ _id: user._id, isEmailVerified: false }, { $inc: { verificationAttempts: 1 } });
    throw new AppError("Invalid or expired verification code. Request a new link if needed.", 400);
  }
  // Atomic consume: concurrent requests cannot verify the same one-time code twice.
  const verified = await User.findOneAndUpdate({ _id: user._id, isEmailVerified: false,
    verificationCodeHash: user.verificationCodeHash, verificationExpiresAt: { $gt: new Date() },
    verificationAttempts: { $lt: MAX_CODE_ATTEMPTS } },
  { $set: { isEmailVerified: true, verificationAttempts: 0, oneTimeCode: null },
    $unset: { verificationCodeHash: "", verificationExpiresAt: "", verificationRequestedAt: "" } }, { new: true });
  if (!verified) throw new AppError("Verification link has already been used or expired", 400);
  return { user: account(verified), ...(await issueSession(verified)) };
};

const loginUser = async (emailInput: string, password: string) => {
  const user = await User.findOne({ email: emailKey(emailInput) }).select("+password");
  if (!user || user.isDeleted || user.suspendedAt || !(await user.isPasswordMatch(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.isEmailVerified) throw new AppError("Please verify your email before signing in", 403);
  return { user: account(user), ...(await issueSession(user)) };
};

const forgotPassword = async (emailInput: string) => {
  const email = emailKey(emailInput);
  const code = newCode();
  const expiry = new Date(Date.now() + CODE_TTL_MS);
  const oldestAllowed = new Date(Date.now() - RESEND_COOLDOWN_MS);
  const user = await User.findOneAndUpdate({ email, isEmailVerified: true, isDeleted: { $ne: true },
    suspendedAt: { $exists: false },
    $or: [{ resetRequestedAt: { $exists: false } }, { resetRequestedAt: { $lte: oldestAllowed } }] },
  { $set: { resetCodeHash: codeHash("reset", email, code), resetExpiresAt: expiry,
    resetRequestedAt: new Date(), resetAttempts: 0 } }, { new: true });
  if (user) {
    try { await scheduleCode(user, "password-reset", code, expiry); }
    catch {
      // Deliberately do not distinguish known from unknown accounts in the public response.
      await User.updateOne({ _id: user._id }, { $unset: { resetRequestedAt: "" } });
      console.error("[JobHub auth] password recovery mail could not be queued");
    }
  }
  return {};
};

const resetPassword = async (emailInput: string, code: string, newPassword: string) => {
  const email = emailKey(emailInput);
  const user = await User.findOne({ email, isDeleted: { $ne: true } }).select("+resetCodeHash");
  if (!user || user.resetAttempts >= MAX_CODE_ATTEMPTS || !user.resetExpiresAt ||
    user.resetExpiresAt < new Date() || !codeMatches(user.resetCodeHash, codeHash("reset", email, code))) {
    if (user) await User.updateOne({ _id: user._id }, { $inc: { resetAttempts: 1 } });
    throw new AppError("Invalid or expired reset code", 400);
  }
  if (user.suspendedAt) throw new AppError("Account temporarily unavailable", 403);
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const updated = await User.findOneAndUpdate({ _id: user._id, resetCodeHash: user.resetCodeHash,
    resetExpiresAt: { $gt: new Date() }, resetAttempts: { $lt: MAX_CODE_ATTEMPTS } },
  { $set: { password: hashedPassword, resetAttempts: 0, oneTimeCode: null },
    $unset: { resetCodeHash: "", resetExpiresAt: "", resetRequestedAt: "" } });
  if (!updated) throw new AppError("Reset link has already been used or expired", 400);
  await revokeAllSessions(user._id.toString());
  return {};
};

const resendVerificationEmail = async (emailInput: string) => {
  const email = emailKey(emailInput);
  const code = newCode();
  const expiry = new Date(Date.now() + CODE_TTL_MS);
  const oldestAllowed = new Date(Date.now() - RESEND_COOLDOWN_MS);
  const user = await User.findOneAndUpdate({ email, isEmailVerified: false, isDeleted: { $ne: true },
    suspendedAt: { $exists: false },
    $or: [{ verificationRequestedAt: { $exists: false } }, { verificationRequestedAt: { $lte: oldestAllowed } }] },
  { $set: { verificationCodeHash: codeHash("verification", email, code), verificationExpiresAt: expiry,
    verificationRequestedAt: new Date(), verificationAttempts: 0 } }, { new: true });
  if (user) {
    try { await scheduleCode(user, "verification", code, expiry); }
    catch {
      await User.updateOne({ _id: user._id }, { $unset: { verificationRequestedAt: "" } });
      console.error("[JobHub auth] verification email could not be queued");
    }
  }
  return {};
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(userId, { $set: { isDeleted: true } }, { new: true });
  if (!user) throw new AppError("User not found", 404);
  await revokeAllSessions(userId);
  await Job.updateMany({ author: userId }, { $set: { isActive: false } });
  await jobService.clearJobCache();
  return {};
};
export default { register, verifyEmail, loginUser, forgotPassword, resetPassword, resendVerificationEmail, deleteUser };
