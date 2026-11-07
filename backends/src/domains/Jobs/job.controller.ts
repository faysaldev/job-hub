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
    salaryRanges,
    companySizes,
    postedDate,
    page,
    limit,
  } = req.query;

  const result = await jobService.searchJobs({
    searchTerm: (q || req.query.search) as string,
    category: category as string,
    subcategory: subcategory as string,
    type: type as string,
    experienceLevel: experienceLevel as string,
    location: location as string,
    locationType: locationType as string,
    minSalary: minSalary ? parseInt(minSalary as string) : undefined,
    maxSalary: maxSalary ? parseInt(maxSalary as string) : undefined,
    salaryRanges: salaryRanges as string,
    companySizes: companySizes as string,
    postedDate: postedDate as string,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

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
  const job = await jobService.getJobById(jobId, (req as ProtectedRequest).user?._id);

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
  const jobs = await jobService.getJobsByAuthorId(authorId, (req as ProtectedRequest).user?._id);

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
  const jobData = { ...req.body, author: req.user!._id };

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
  const updated = await jobService.updateJob(jobId, updateData, req.user!._id);
  if (!updated) throw new AppError("Job not found or permission denied", 404);

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

  const deleted = await jobService.deleteJob(jobId, req.user!._id);
  if (!deleted) throw new AppError("Job not found or permission denied", 404);

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
    search,
    category,
    subcategory,
    type,
    location,
    locationType,
    experienceLevel,
    minSalary,
    maxSalary,
    salaryRanges,
    companySizes,
    postedDate,
    page,
    limit,
  } = req.query;

  const result = await jobService.searchJobs({
    searchTerm: search as string,
    category: category as string,
    subcategory: subcategory as string,
    type: type as string,
    experienceLevel: experienceLevel as string,
    location: location as string,
    locationType: locationType as string,
    minSalary: minSalary ? parseInt(minSalary as string) : undefined,
    maxSalary: maxSalary ? parseInt(maxSalary as string) : undefined,
    salaryRanges: salaryRanges as string,
    companySizes: companySizes as string,
    postedDate: postedDate as string,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

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
