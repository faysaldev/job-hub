import { Request, Response } from "express";
import userService from "./user.services";
import { asyncHandler } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(httpStatus.OK).json(
    response({
      message: "Users retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: users,
    }),
  );
});

const userDetails = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { user } = req;
    const users = await userService.userDetails(user?._id as string);

    res.status(httpStatus.OK).json(
      response({
        message: "User Details",
        status: "OK",
        statusCode: httpStatus.OK,
        data: users!,
      }),
    );
  },
);

const updateUser = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const user = await userService.updateUser(
      req?.user?._id as string,
      req.body,
    );
    res.status(httpStatus.OK).json(
      response({
        message: "User Updated Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      }),
    );
  },
);

const changePassword = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    await userService.changePassword(req.user?._id as string, oldPassword, newPassword);
    res.status(httpStatus.OK).json(
      response({
        message: "Password changed successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      }),
    );
  },
);

const deleteProfile = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { password } = req.body;
    await userService.deleteProfile(req.user?._id as string, password);
    res.status(httpStatus.OK).json(
      response({
        message: "Profile deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      }),
    );
  },
);

const userController = {
  getAllUsers,
  userDetails,
  updateUser,
  changePassword,
  deleteProfile,
};

export default userController;
