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
    q,
    category,
    subcategory,
    type,
    location,
    locationType,
    experienceLevel,
    minSalary,
    maxSalary,
    page,
    limit,
  } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;

  const result = await jobService.searchJobs(
    q as string,
    category as string,
    subcategory as string,
    type as string,
    experienceLevel as string,
    location as string,
    locationType as string,
    minSalary ? parseInt(minSalary as string) : undefined,
    maxSalary ? parseInt(maxSalary as string) : undefined,
    pageNum,
    limitNum,
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Jobs retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    }),
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
    }),
  );
});

// Get jobs by author ID
const getJobsByAuthorId = asyncHandler(async (req: Request, res: Response) => {
  const { authorId } = req.params;
  const jobs = await jobService.getJobsByAuthorId(authorId);

  res.status(httpStatus.OK).json(
    response({
      message: "Jobs retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: jobs,
    }),
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
    }),
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
    }),
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
    }),
  );
});

// Search jobs with advanced filters and pagination
const searchJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    q,
    category,
    subcategory,
    type,
    location,
    locationType,
    experienceLevel,
    minSalary,
    maxSalary,
    page,
    limit,
  } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;

  const result = await jobService.searchJobs(
    q as string,
    category as string,
    subcategory as string,
    type as string,
    experienceLevel as string,
    location as string,
    locationType as string,
    minSalary ? parseInt(minSalary as string) : undefined,
    maxSalary ? parseInt(maxSalary as string) : undefined,
    pageNum,
    limitNum,
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Search results retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    }),
  );
});

const jobController = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
  getJobsByAuthorId,
};

export default jobController;
