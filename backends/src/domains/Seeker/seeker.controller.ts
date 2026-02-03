import { Request, Response } from "express";
import {
  createSeekerService,
  getAllSeekersService,
  getSeekerByUserIdService,
  updateSeekerByUserIdService,
} from "./seeker.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

export const createSeeker = asyncHandler(async (req: Request, res: Response) => {
  const seekerData = req.body;
  const protectedReq = req as ProtectedRequest;

  if (protectedReq.user) {
    seekerData.userId = protectedReq.user._id;
  }

  const seeker = await createSeekerService(seekerData);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Seeker profile created successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: seeker,
    })
  );
});

export const getSeeker = asyncHandler(async (req: Request, res: Response) => {
  const protectedReq = req as ProtectedRequest;

  if (!protectedReq.user?._id) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const seeker = await getSeekerByUserIdService(protectedReq.user._id);

  if (!seeker) {
    throw new AppError("Seeker profile not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Seeker profile retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: seeker,
    })
  );
});

export const getAllSeekers = asyncHandler(async (req: Request, res: Response) => {
  const seekers = await getAllSeekersService();

  res.status(httpStatus.OK).json(
    response({
      message: "Seekers retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: seekers,
    })
  );
});

export const updateSeeker = asyncHandler(async (req: Request, res: Response) => {
  const protectedReq = req as ProtectedRequest;

  if (!protectedReq.user?._id) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const seekerData = req.body;
  const updatedSeeker = await updateSeekerByUserIdService(
    protectedReq.user._id,
    seekerData
  );

  if (!updatedSeeker) {
    throw new AppError("Seeker profile not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Seeker profile updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updatedSeeker,
    })
  );
});
