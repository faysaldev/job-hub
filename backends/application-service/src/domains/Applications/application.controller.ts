import { Request, Response } from "express";
import applicationService from "./application.services";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

// Create a new job application
const createApplication = async (req: ProtectedRequest, res: Response) => {
  try {
    const applicationData = req.body;
    const userId = req.user?._id;

    // Add the applicant ID from the authenticated user
    applicationData.applicant = userId;

    // Validate required fields
    if (!applicationData.resume_url || !applicationData.job_id) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Resume URL and Job ID are required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Validate ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/;
    if (!isValidObjectId.test(applicationData.job_id)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Invalid Job ID format",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (userId && !isValidObjectId.test(userId.toString())) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Invalid User ID format",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const application = await applicationService.createApplication(
      applicationData
    );

    res.status(httpStatus.CREATED).json(
      response({
        message: "Application created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: application,
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

// Get all applications for the authenticated user
const getUserApplications = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    console.log(userId);

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

    const applications = await applicationService.getApplicationsByApplicant(
      userId.toString()
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Applications retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: applications,
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

// Update application status
const updateApplicationStatus = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Status is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const updatedApplication = await applicationService.updateApplicationStatus(
      applicationId,
      status
    );

    if (!updatedApplication) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Application not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Application status updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedApplication,
      })
    );
  } catch (error: any) {
    if (error.message === "Invalid status value") {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: error.message,
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
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

// Delete an application
const deleteApplication = async (req: ProtectedRequest, res: Response) => {
  try {
    const { applicationId } = req.params;

    const deletedApplication = await applicationService.deleteApplication(
      applicationId
    );

    if (!deletedApplication) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Application not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Application deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: deletedApplication,
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

const applicationController = {
  createApplication,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication,
};

export default applicationController;
