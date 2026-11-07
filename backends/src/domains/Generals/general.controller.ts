import { Request, Response } from "express";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { asyncHandler } from "../../lib/errorsHandle";
import { ProtectedRequest } from "../../types/protected-request";
import generalService from "./general.services";

const getHeaderStats = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?._id;
    const stats = await generalService.getHeaderStats(userId as string);

    res.status(httpStatus.OK).json(
      response({
        message: "Header stats retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: stats,
      }),
    );
  },
);

const getCategoryStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await generalService.getCategoryStats();

  res.status(httpStatus.OK).json(
    response({
      message: "Category stats retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: stats,
    }),
  );
});

// Homepage discovery payload: replaces two client round-trips with one public read.
// Existing /category-stats and /top-jobs endpoints remain for older clients.
const getDiscovery = asyncHandler(async (_req: Request, res: Response) => {
  const [categoryStats, topJobs] = await Promise.all([
    generalService.getCategoryStats(),
    generalService.getDiscoveryJobs(),
  ]);
  res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=30");
  res.status(httpStatus.OK).json(response({
    message: "Discovery content retrieved successfully",
    status: "OK", statusCode: httpStatus.OK,
    data: { categoryStats, topJobs },
  }));
});

const getSubcategoryStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await generalService.getSubcategoryStats();

    res.status(httpStatus.OK).json(
      response({
        message: "Subcategory stats retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: stats,
      }),
    );
  },
);

const getTopJobs = asyncHandler(async (req: Request, res: Response) => {
  const jobs = await generalService.getTopJobs();

  res.status(httpStatus.OK).json(
    response({
      message: "Top jobs retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: jobs,
    }),
  );
});

const getSeekerDashboardStats = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?._id;
    const stats = await generalService.getSeekerDashboardStats(
      userId as string,
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Seeker dashboard stats retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: stats,
      }),
    );
  },
);

const getAppliedJobIds = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?._id;
    const jobIds = await generalService.getAppliedJobIds(userId as string);

    res.status(httpStatus.OK).json(
      response({
        message: "Applied job IDs retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: jobIds,
      }),
    );
  },
);

const getSavedJobIds = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?._id;
    const jobIds = await generalService.getSavedJobIds(userId as string);

    res.status(httpStatus.OK).json(
      response({
        message: "Saved job IDs retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: jobIds,
      }),
    );
  },
);

const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const contactData = req.body;
  const contact = await generalService.submitContactForm(contactData);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Contact form submitted successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: contact,
    }),
  );
});

const getRecruiterDashboardStats = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const recruiterId = req.user?._id;
    const stats = await generalService.getRecruiterDashboardStats(
      recruiterId as string,
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Recruiter dashboard stats retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: stats,
      }),
    );
  },
);

const generalController = {
  getHeaderStats,
  getDiscovery,
  getCategoryStats,
  getSubcategoryStats,
  getTopJobs,
  getSeekerDashboardStats,
  getAppliedJobIds,
  submitContactForm,
  getRecruiterDashboardStats,
  getSavedJobIds,
};

export default generalController;
