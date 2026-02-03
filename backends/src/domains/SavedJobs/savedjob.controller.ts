import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import savedJobService from "./savedjob.services";

// Save a job
const saveJob = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { jobId } = req.body;
  const userId = req.user?._id;

  if (!jobId) {
    throw new AppError("Job ID is required", httpStatus.BAD_REQUEST);
  }

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const result = await savedJobService.saveJob(userId.toString(), jobId);

  res.status(httpStatus.OK).json(
    response({
      message: "Job saved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// Get all saved jobs for the authenticated user
const getUserSavedJobs = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const savedJobs = await savedJobService.getUserSavedJobs(userId.toString());

  res.status(httpStatus.OK).json(
    response({
      message: "Saved jobs retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: savedJobs,
    })
  );
});

// Delete a saved job
const deleteSavedJob = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { jobId } = req.params;
  const userId = req.user?._id;

  if (!jobId) {
    throw new AppError("Job ID is required", httpStatus.BAD_REQUEST);
  }

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const result = await savedJobService.deleteSavedJob(userId.toString(), jobId);

  if (!result) {
    throw new AppError("Saved job not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Saved job removed successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

export default { saveJob, getUserSavedJobs, deleteSavedJob };
