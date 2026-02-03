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
    })
  );
});

const userDetails = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { user } = req;
  const users = await userService.userDetails(user?._id as string);

  res.status(httpStatus.OK).json(
    response({
      message: "User Details",
      status: "OK",
      statusCode: httpStatus.OK,
      data: users!,
    })
  );
});

const singleFileUpload = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  res.status(httpStatus.OK).json(
    response({
      message: "File uploaded successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { path: req.file?.path },
    })
  );
});

const multipleFileUpload = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  res.status(httpStatus.OK).json(
    response({
      message: "Files uploaded successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { files: req.files },
    })
  );
});

const userController = {
  getAllUsers,
  userDetails,
  singleFileUpload,
  multipleFileUpload,
};

export default userController;
