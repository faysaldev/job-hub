import { Request, Response } from "express";
import userService from "./message.services";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import { ProtectedUser } from "../../types/types";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(httpStatus.CREATED).json(
      response({
        message: "Create Notification",
        status: "OK",
        statusCode: httpStatus.OK,
        data: users,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

const userDetails = async (req: ProtectedRequest, res: Response) => {
  try {
    const { user } = req;
    const users = await userService.userDetails(user?._id as string);

    res.status(httpStatus.CREATED).json(
      response({
        message: "User Details",
        status: "OK",
        statusCode: httpStatus.OK,
        data: users!,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

export default { getAllUsers, userDetails };
