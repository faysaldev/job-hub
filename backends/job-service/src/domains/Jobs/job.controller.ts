import { Request, Response } from "express";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import jobService from "./job.services";

// Get all jobs with optional filters and pagination
const getAllJobs = async (req: Request, res: Response) => {
  try {
    const {
      job_type, // Job type: full-time, part-time, contract, internship, freelance
      experience, // Experience level: entry, mid, senior, lead
      location, // Location: remote, onsite, hybrid
      q, // Search query for job title, company name, skills
      min_salary, // Minimum salary for range filter
      max_salary, // Maximum salary for range filter
      page = 1, // Page number for pagination (default: 1)
      limit = 10, // Number of jobs per page (default: 10)
    } = req.query;

    // Validate page and limit parameters
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    // Validate enum values if provided
    const validJobTypes = [
      "full-time",
      "part-time",
      "contract",
      "internship",
      "freelance",
    ];
    const validLocations = ["remote", "onsite", "hybrid"];
    const validExperiences = ["entry", "mid", "senior", "lead"];

    if (job_type && !validJobTypes.includes(job_type as string)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: `Invalid job type. Valid values are: ${validJobTypes.join(
            ", "
          )}`,
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (location && !validLocations.includes(location as string)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: `Invalid location. Valid values are: ${validLocations.join(
            ", "
          )}`,
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (experience && !validExperiences.includes(experience as string)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: `Invalid experience level. Valid values are: ${validExperiences.join(
            ", "
          )}`,
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Validate salary parameters
    let minSalary: number | undefined;
    let maxSalary: number | undefined;

    if (min_salary !== undefined) {
      minSalary = parseFloat(min_salary as string);
      if (isNaN(minSalary)) {
        return res.status(httpStatus.BAD_REQUEST).json(
          response({
            message: "Invalid minimum salary value",
            status: "ERROR",
            statusCode: httpStatus.BAD_REQUEST,
            data: {},
          })
        );
      }
    }

    if (max_salary !== undefined) {
      maxSalary = parseFloat(max_salary as string);
      if (isNaN(maxSalary)) {
        return res.status(httpStatus.BAD_REQUEST).json(
          response({
            message: "Invalid maximum salary value",
            status: "ERROR",
            statusCode: httpStatus.BAD_REQUEST,
            data: {},
          })
        );
      }
    }

    if (
      minSalary !== undefined &&
      maxSalary !== undefined &&
      minSalary > maxSalary
    ) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Minimum salary cannot be greater than maximum salary",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Call the service with all parameters
    const result = await jobService.searchJobs(
      q as string, // Search query
      job_type as string, // Job type
      experience as string, // Experience level
      location as string, // Location
      minSalary, // Min salary
      maxSalary, // Max salary
      pageNum, // Page number
      limitNum // Limit per page
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Jobs retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
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
    jobData.author = req.user?._id; // Associate the job with the authenticated user

    console.log(jobData, "Jobs Data");
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

// Search jobs with advanced filters and pagination
const searchJobs = async (req: Request, res: Response) => {
  try {
    const {
      q, // Search query for job title, company name, skills
      job_type, // Job type: full-time, part-time, contract, internship, freelance
      experience, // Experience level: entry, mid, senior, lead
      location, // Location: remote, onsite, hybrid
      min_salary, // Minimum salary for range filter
      max_salary, // Maximum salary for range filter
      page = 1, // Page number for pagination (default: 1)
      limit = 10, // Number of jobs per page (default: 10)
    } = req.query;

    // Validate page and limit parameters
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    // Validate enum values if provided
    const validJobTypes = [
      "full-time",
      "part-time",
      "contract",
      "internship",
      "freelance",
    ];
    const validLocations = ["remote", "onsite", "hybrid"];
    const validExperiences = ["entry", "mid", "senior", "lead"];

    if (job_type && !validJobTypes.includes(job_type as string)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: `Invalid job type. Valid values are: ${validJobTypes.join(
            ", "
          )}`,
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (location && !validLocations.includes(location as string)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: `Invalid location. Valid values are: ${validLocations.join(
            ", "
          )}`,
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (experience && !validExperiences.includes(experience as string)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: `Invalid experience level. Valid values are: ${validExperiences.join(
            ", "
          )}`,
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Validate salary parameters
    let minSalary: number | undefined;
    let maxSalary: number | undefined;

    if (min_salary !== undefined) {
      minSalary = parseFloat(min_salary as string);
      if (isNaN(minSalary)) {
        return res.status(httpStatus.BAD_REQUEST).json(
          response({
            message: "Invalid minimum salary value",
            status: "ERROR",
            statusCode: httpStatus.BAD_REQUEST,
            data: {},
          })
        );
      }
    }

    if (max_salary !== undefined) {
      maxSalary = parseFloat(max_salary as string);
      if (isNaN(maxSalary)) {
        return res.status(httpStatus.BAD_REQUEST).json(
          response({
            message: "Invalid maximum salary value",
            status: "ERROR",
            statusCode: httpStatus.BAD_REQUEST,
            data: {},
          })
        );
      }
    }

    if (
      minSalary !== undefined &&
      maxSalary !== undefined &&
      minSalary > maxSalary
    ) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Minimum salary cannot be greater than maximum salary",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Call the service with all parameters
    const result = await jobService.searchJobs(
      q as string, // Search query
      job_type as string, // Job type
      experience as string, // Experience level
      location as string, // Location
      minSalary, // Min salary
      maxSalary, // Max salary
      pageNum, // Page number
      limitNum // Limit per page
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Search results retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
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
};

export default jobController;
