import { Request, Response } from "express";
import authService from "./auth.service";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import { rotateSession, revokeByRefreshToken } from "./auth.token.services";

const COOKIE_NAME = "jobhub_refresh";
const cookieSameSite = (process.env.AUTH_COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "none" : "lax"));
const crossSite = cookieSameSite === "none";
const cookieOptions = { httpOnly: true, secure: crossSite || process.env.NODE_ENV === "production",
  sameSite: (crossSite ? "none" : "lax") as "none" | "lax", path: "/api/v1/auth" };
const setRefreshCookie = (res: Response, token: string) => res.cookie(COOKIE_NAME, token, {
  ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });
export const clearRefreshCookie = (res: Response) => res.clearCookie(COOKIE_NAME, cookieOptions);
const currentRefreshCookie = (req: Request): string | undefined => {
  const value = req.headers.cookie?.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!value) return undefined;
  try { return decodeURIComponent(value.slice(COOKIE_NAME.length + 1)); }
  catch { return undefined; }
};
const ok = (res: Response, message: string, data: object = {}, code = 200) =>
  res.status(code).json(response({ message, status: "OK", statusCode: code, data }));

const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.register(req.body);
  ok(res, "Account created. Check your email or resend the verification link.", data, 201);
});
const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const { refreshToken, ...data } = await authService.verifyEmail(email, code);
  setRefreshCookie(res, refreshToken);
  ok(res, "Email verified", data);
});
const login = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken, ...data } = await authService.loginUser(req.body.email, req.body.password);
  setRefreshCookie(res, refreshToken);
  ok(res, "Login successful", data);
});
const refresh = asyncHandler(async (req: Request, res: Response) => {
  const cookie = currentRefreshCookie(req);
  if (!cookie) throw new AppError("Refresh session missing", 401);
  const { user, accessToken, refreshToken } = await rotateSession(cookie);
  setRefreshCookie(res, refreshToken);
  ok(res, "Session refreshed", { user: { _id: user._id, name: user.name, email: user.email,
    role: user.role, image: user.image, phoneNumber: user.phoneNumber,
    isEmailVerified: user.isEmailVerified, createdAt: user.get("createdAt") }, accessToken });
});
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  ok(res, "If the account is eligible, a password reset link will be emailed shortly.");
});
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.email, req.body.code, req.body.newPassword);
  clearRefreshCookie(res);
  ok(res, "Password reset. Please sign in with your new password.");
});
const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  await authService.resendVerificationEmail(req.body.email);
  ok(res, "If verification is pending, a new link will be sent shortly.");
});
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await authService.deleteUser(req.params.userId);
  ok(res, "User disabled");
});
const logout = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const cookie = currentRefreshCookie(req);
  if (cookie) await revokeByRefreshToken(cookie);
  clearRefreshCookie(res);
  ok(res, "Logged out");
});
export default { register, verifyEmail, login, refresh, forgotPassword, resetPassword, resendVerification, deleteUser, logout };
