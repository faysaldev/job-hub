import { Response } from "express";
import applicationService from "./application.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

import { createNotification } from "../Notifications/notifications.service";
import Job from "../Jobs/job.model";

// Create a new job application
const createApplication = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const applicationData = req.body;
    const userId = req.user?._id;

    applicationData.applicant = userId;

    if (!applicationData.resume_url || !applicationData.job_id) {
      throw new AppError(
        "Resume URL and Job ID are required",
        httpStatus.BAD_REQUEST,
      );
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/;
    if (!isValidObjectId.test(applicationData.job_id)) {
      throw new AppError("Invalid Job ID format", httpStatus.BAD_REQUEST);
    }

    const application =
      await applicationService.createApplication(applicationData);

    // OPTIMIZATION: Send notification to the job recruiter
    try {
      const job = await Job.findById(applicationData.job_id);
      if (job && job.author) {
        await createNotification({
          title: `New application for "${job.title}"`,
          link: `/recruiter/applications`,
          sender: userId as string,
          receiver: job.author.toString(),
        });
      }
    } catch (err) {
      console.error("Failed to send notification:", err);
      // Don't fail the request if notification fails
    }

    res.status(httpStatus.CREATED).json(
      response({
        message: "Application created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: application,
      }),
    );
  },
);

// Get all applications for the authenticated user
const getUserApplications = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
    }

    const applications = await applicationService.getApplicationsByApplicant(
      userId.toString(),
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Applications retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: applications,
      }),
    );
  },
);

// Update application status
const updateApplicationStatus = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { applicationId } = req.params;
    const { status, rejection_note } = req.body;
    const userId = req.user?._id;

    if (!status) {
      throw new AppError("Status is required", httpStatus.BAD_REQUEST);
    }

    const updatedApplication = await applicationService.updateApplicationStatus(
      applicationId,
      status,
      rejection_note,
    );

    if (!updatedApplication) {
      throw new AppError("Application not found", httpStatus.NOT_FOUND);
    }

    // OPTIMIZATION: Send notification to the applicant about status change
    try {
      const job = await Job.findById(updatedApplication.job_id);
      await createNotification({
        title: `Your application for "${job?.title || "Job"}" was updated to ${status}`,
        link: `/job-seeker/applications`,
        sender: userId as string,
        receiver: updatedApplication.applicant.toString(),
      });
    } catch (err) {
      console.error("Failed to send status notification:", err);
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Application status updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedApplication,
      }),
    );
  },
);

// Delete an application
const deleteApplication = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { applicationId } = req.params;

    const deletedApplication =
      await applicationService.deleteApplication(applicationId);

    if (!deletedApplication) {
      throw new AppError("Application not found", httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Application deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: deletedApplication,
      }),
    );
  },
);

// Get all applications for jobs owned by the recruiter
const getRecruiterApplications = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const recruiterId = req.user?._id;
    const filters = req.query;

    const applications = await applicationService.getRecruiterApplications(
      recruiterId as string,
      filters,
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Recruiter applications retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: applications,
      }),
    );
  },
);

const applicationController = {
  createApplication,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication,
  getRecruiterApplications,
};

export default applicationController;
