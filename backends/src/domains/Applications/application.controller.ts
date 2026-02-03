import { Response } from "express";
import applicationService from "./application.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

// Create a new job application
const createApplication = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const applicationData = req.body;
  const userId = req.user?._id;

  applicationData.applicant = userId;

  if (!applicationData.resume_url || !applicationData.job_id) {
    throw new AppError("Resume URL and Job ID are required", httpStatus.BAD_REQUEST);
  }

  const isValidObjectId = /^[0-9a-fA-F]{24}$/;
  if (!isValidObjectId.test(applicationData.job_id)) {
    throw new AppError("Invalid Job ID format", httpStatus.BAD_REQUEST);
  }

  if (userId && !isValidObjectId.test(userId.toString())) {
    throw new AppError("Invalid User ID format", httpStatus.BAD_REQUEST);
  }

  const application = await applicationService.createApplication(applicationData);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Application created successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: application,
    })
  );
});

// Get all applications for the authenticated user
const getUserApplications = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const applications = await applicationService.getApplicationsByApplicant(userId.toString());

  res.status(httpStatus.OK).json(
    response({
      message: "Applications retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: applications,
    })
  );
});

// Update application status
const updateApplicationStatus = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError("Status is required", httpStatus.BAD_REQUEST);
  }

  const updatedApplication = await applicationService.updateApplicationStatus(
    applicationId,
    status
  );

  if (!updatedApplication) {
    throw new AppError("Application not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Application status updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updatedApplication,
    })
  );
});

// Delete an application
const deleteApplication = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { applicationId } = req.params;

  const deletedApplication = await applicationService.deleteApplication(applicationId);

  if (!deletedApplication) {
    throw new AppError("Application not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Application deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: deletedApplication,
    })
  );
});

const applicationController = {
  createApplication,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication,
};

export default applicationController;
