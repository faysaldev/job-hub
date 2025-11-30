import { Request, Response } from "express";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import jobService from "./job.services";

// Get all jobs
const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { job_type, experience, location, search } = req.query;
    const filters: any = {};

    if (job_type) filters.job_type = job_type;
    if (experience) filters.experience = experience;
    if (location) filters.location = location;

    let jobs;
    if (search) {
      jobs = await jobService.searchJobs(search as string);
    } else {
      jobs = await jobService.getAllJobs(filters);
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Jobs retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: jobs,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Get job by ID
const getJobById = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await jobService.getJobById(jobId);

    if (!job) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Job not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Job retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: job,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Create a new job (requires authentication)
const createJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const jobData = req.body;
    jobData.createdBy = req.user?._id; // Associate the job with the authenticated user

    const job = await jobService.createJob(jobData);

    res.status(httpStatus.CREATED).json(
      response({
        message: "Job created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: job,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Update a job (requires authentication)
const updateJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    // Check if the job exists
    const existingJob = await jobService.getJobById(jobId);
    if (!existingJob) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Job not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    // Check if the current user is authorized to update this job
    // In a real implementation, you'd check permissions here
    const updatedJob = await jobService.updateJob(jobId, updateData);

    res.status(httpStatus.OK).json(
      response({
        message: "Job updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Delete a job (requires authentication)
const deleteJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const { jobId } = req.params;

    // Check if the job exists
    const existingJob = await jobService.getJobById(jobId);
    if (!existingJob) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Job not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    // In a real implementation, you'd check permissions here
    await jobService.deleteJob(jobId);

    res.status(httpStatus.OK).json(
      response({
        message: "Job deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Search jobs
const searchJobs = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Search query is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const jobs = await jobService.searchJobs(q as string);

    res.status(httpStatus.OK).json(
      response({
        message: "Search results retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: jobs,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Get jobs by type
const getJobsByType = async (req: Request, res: Response) => {
  try {
    const { jobType } = req.params;
    const jobs = await jobService.getJobsByType(jobType);

    res.status(httpStatus.OK).json(
      response({
        message: "Jobs retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: jobs,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Get jobs by experience level
const getJobsByExperience = async (req: Request, res: Response) => {
  try {
    const { experience } = req.params;
    const jobs = await jobService.getJobsByExperience(experience);

    res.status(httpStatus.OK).json(
      response({
        message: "Jobs retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: jobs,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

const jobController = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
  getJobsByType,
  getJobsByExperience,
};

export default jobController;
