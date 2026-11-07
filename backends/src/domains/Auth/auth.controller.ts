import { Request, Response } from "express";
import authService from "./auth.service";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import { revokeSession, rotateSession, revokeByRefreshToken } from "./auth.token.services";

const COOKIE_NAME = "jobhub_refresh";
const crossSite = process.env.AUTH_COOKIE_SAME_SITE === "none" || (process.env.NODE_ENV === "production" && process.env.AUTH_COOKIE_SAME_SITE !== "lax");
const cookieOptions = { httpOnly: true, secure: crossSite || process.env.NODE_ENV === "production",
  sameSite: (crossSite ? "none" : "lax") as "none" | "lax", path: "/api/v1/auth" };
const setRefreshCookie = (res: Response, token: string) => res.cookie(COOKIE_NAME, token, {
  ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });
const clearRefreshCookie = (res: Response) => res.clearCookie(COOKIE_NAME, cookieOptions);
const currentRefreshCookie = (req: Request) => {
  const raw = req.headers.cookie?.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return raw ? decodeURIComponent(raw.slice(COOKIE_NAME.length + 1)) : undefined;
};
const ok = (res: Response, message: string, data: object = {}, code = 200) =>
  res.status(code).json(response({ message, status: "OK", statusCode: code, data }));

const register = asyncHandler(async (req: Request, res: Response) => {
  await authService.register(req.body);
  ok(res, "Registration received. Check your email for verification.", {}, 201);
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
    isEmailVerified: user.isEmailVerified }, accessToken });
});
const forgotPassword = asyncHandler(async (req: Request, res: Response) =>
  ok(res, "If registered, a reset email has been sent", await authService.forgotPassword(req.body.email)));
const resetPassword = asyncHandler(async (req: Request, res: Response) =>
  ok(res, "Password reset successful", await authService.resetPassword(req.body.email, req.body.code, req.body.newPassword)));
const resendVerification = asyncHandler(async (req: Request, res: Response) =>
  ok(res, "If verification is pending, another email has been sent", await authService.resendVerificationEmail(req.body.email)));
const deleteUser = asyncHandler(async (req: Request, res: Response) =>
  ok(res, "User disabled", await authService.deleteUser(req.params.userId)));
const logout = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  // Refresh cookies are usable to log out even when the 15-minute access token has expired.
  const refreshCookie = currentRefreshCookie(req);
  if (refreshCookie) await revokeByRefreshToken(refreshCookie);
  clearRefreshCookie(res);
  ok(res, "Logged out", {});
});
export default { register, verifyEmail, login, refresh, forgotPassword, resetPassword, resendVerification, deleteUser, logout };
