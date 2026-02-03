import { Request, Response } from "express";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import jobService from "./job.services";

// Get all jobs with optional filters and pagination
const getAllJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    job_type,
    experience,
    location,
    q,
    min_salary,
    max_salary,
    page = 1,
    limit = 10,
  } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;

  const validJobTypes = ["full-time", "part-time", "contract", "internship", "freelance"];
  const validLocations = ["remote", "onsite", "hybrid"];
  const validExperiences = ["entry", "mid", "senior", "lead"];

  if (job_type && !validJobTypes.includes(job_type as string)) {
    throw new AppError(
      `Invalid job type. Valid values are: ${validJobTypes.join(", ")}`,
      httpStatus.BAD_REQUEST
    );
  }

  if (location && !validLocations.includes(location as string)) {
    throw new AppError(
      `Invalid location. Valid values are: ${validLocations.join(", ")}`,
      httpStatus.BAD_REQUEST
    );
  }

  if (experience && !validExperiences.includes(experience as string)) {
    throw new AppError(
      `Invalid experience level. Valid values are: ${validExperiences.join(", ")}`,
      httpStatus.BAD_REQUEST
    );
  }

  let minSalary: number | undefined;
  let maxSalary: number | undefined;

  if (min_salary !== undefined) {
    minSalary = parseFloat(min_salary as string);
    if (isNaN(minSalary)) {
      throw new AppError("Invalid minimum salary value", httpStatus.BAD_REQUEST);
    }
  }

  if (max_salary !== undefined) {
    maxSalary = parseFloat(max_salary as string);
    if (isNaN(maxSalary)) {
      throw new AppError("Invalid maximum salary value", httpStatus.BAD_REQUEST);
    }
  }

  if (minSalary !== undefined && maxSalary !== undefined && minSalary > maxSalary) {
    throw new AppError(
      "Minimum salary cannot be greater than maximum salary",
      httpStatus.BAD_REQUEST
    );
  }

  const result = await jobService.searchJobs(
    q as string,
    job_type as string,
    experience as string,
    location as string,
    minSalary,
    maxSalary,
    pageNum,
    limitNum
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Jobs retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// Get job by ID
const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = await jobService.getJobById(jobId);

  if (!job) {
    throw new AppError("Job not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Job retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: job,
    })
  );
});

// Create a new job (requires authentication)
const createJob = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const jobData = req.body;
  jobData.author = req.user?._id;

  const job = await jobService.createJob(jobData);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Job created successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: job,
    })
  );
});

// Update a job (requires authentication)
const updateJob = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { jobId } = req.params;
  const updateData = req.body;

  const existingJob = await jobService.getJobById(jobId);
  if (!existingJob) {
    throw new AppError("Job not found", httpStatus.NOT_FOUND);
  }

  await jobService.updateJob(jobId, updateData);

  res.status(httpStatus.OK).json(
    response({
      message: "Job updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// Delete a job (requires authentication)
const deleteJob = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { jobId } = req.params;

  const existingJob = await jobService.getJobById(jobId);
  if (!existingJob) {
    throw new AppError("Job not found", httpStatus.NOT_FOUND);
  }

  await jobService.deleteJob(jobId);

  res.status(httpStatus.OK).json(
    response({
      message: "Job deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// Search jobs with advanced filters and pagination
const searchJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    q,
    job_type,
    experience,
    location,
    min_salary,
    max_salary,
    page = 1,
    limit = 10,
  } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;

  const validJobTypes = ["full-time", "part-time", "contract", "internship", "freelance"];
  const validLocations = ["remote", "onsite", "hybrid"];
  const validExperiences = ["entry", "mid", "senior", "lead"];

  if (job_type && !validJobTypes.includes(job_type as string)) {
    throw new AppError(
      `Invalid job type. Valid values are: ${validJobTypes.join(", ")}`,
      httpStatus.BAD_REQUEST
    );
  }

  if (location && !validLocations.includes(location as string)) {
    throw new AppError(
      `Invalid location. Valid values are: ${validLocations.join(", ")}`,
      httpStatus.BAD_REQUEST
    );
  }

  if (experience && !validExperiences.includes(experience as string)) {
    throw new AppError(
      `Invalid experience level. Valid values are: ${validExperiences.join(", ")}`,
      httpStatus.BAD_REQUEST
    );
  }

  let minSalary: number | undefined;
  let maxSalary: number | undefined;

  if (min_salary !== undefined) {
    minSalary = parseFloat(min_salary as string);
    if (isNaN(minSalary)) {
      throw new AppError("Invalid minimum salary value", httpStatus.BAD_REQUEST);
    }
  }

  if (max_salary !== undefined) {
    maxSalary = parseFloat(max_salary as string);
    if (isNaN(maxSalary)) {
      throw new AppError("Invalid maximum salary value", httpStatus.BAD_REQUEST);
    }
  }

  if (minSalary !== undefined && maxSalary !== undefined && minSalary > maxSalary) {
    throw new AppError(
      "Minimum salary cannot be greater than maximum salary",
      httpStatus.BAD_REQUEST
    );
  }

  const result = await jobService.searchJobs(
    q as string,
    job_type as string,
    experience as string,
    location as string,
    minSalary,
    maxSalary,
    pageNum,
    limitNum
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Search results retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const jobController = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
};

export default jobController;
