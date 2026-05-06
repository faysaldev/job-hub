import { Request, Response } from "express";
import authService from "./auth.service";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { addActivityLogService } from "../Seeker/seeker.services";

const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created Successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: { code: user?.oneTimeCode },
    }),
  );
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  console.log(email, code, "code");
  const data = await authService.verifyEmail(email, code);
  res.status(httpStatus.OK).json(
    response({
      message: "Verification Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: data,
    }),
  );
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);

  // Log activity for the user
  if (user?.user?._id) {
    await addActivityLogService(
      user.user._id.toString(),
      "Logged in to the platform",
    );
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Login Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    }),
  );
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);
  res.status(httpStatus.OK).json(
    response({
      message: "Verification email sent successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    }),
  );
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { code, newPassword, email } = req.body;
  const result = await authService.resetPassword(email, code, newPassword);
  res.status(httpStatus.OK).json(
    response({
      message: "Password Reset Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    }),
  );
});

const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.resendVerificationEmail(req.body.email);
  res.status(httpStatus.OK).json(
    response({
      message: "Verification code resent successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    }),
  );
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.deleteUser(req.params.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "User Deleted Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    }),
  );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.headers.authorization?.split(" ")[1];
  if (!refreshToken) {
    throw new AppError("Refresh token required", httpStatus.BAD_REQUEST);
  }

  const result = await authService.logout(refreshToken);
  res.status(httpStatus.OK).json(
    response({
      message: "Logged out successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    }),
  );
});

const authController = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  resendVerification,
  deleteUser,
  logout,
};

export default authController;
