import { Request, Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import savedJobService from "./savedjob.services";

// Save a job
const saveJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id;

    if (!jobId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Job ID is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: {},
        })
      );
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
  } catch (error: any) {
    if (error.message === "Job is already saved by this user") {
      return res.status(httpStatus.CONFLICT).json(
        response({
          message: error.message,
          status: "ERROR",
          statusCode: httpStatus.CONFLICT,
          data: {},
        })
      );
    } else if (error.message === "Job not found") {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: error.message,
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    const handledError = handleError(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
    );
  }
};

// Get all saved jobs for the authenticated user
const getUserSavedJobs = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: {},
        })
      );
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
  } catch (error) {
    const handledError = handleError(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
    );
  }
};

// Delete a saved job
const deleteSavedJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?._id;

    if (!jobId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Job ID is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: {},
        })
      );
    }

    const result = await savedJobService.deleteSavedJob(
      userId.toString(),
      jobId
    );

    if (!result) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Saved job not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Saved job removed successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
    );
  }
};

export default { saveJob, getUserSavedJobs, deleteSavedJob };
