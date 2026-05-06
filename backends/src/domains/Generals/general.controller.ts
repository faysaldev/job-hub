import { Request, Response } from "express";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { asyncHandler } from "../../lib/errorsHandle";
import { ProtectedRequest } from "../../types/protected-request";
import generalService from "./general.services";

const getHeaderStats = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id;
  const stats = await generalService.getHeaderStats(userId as string);

  res.status(httpStatus.OK).json(
    response({
      message: "Header stats retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: stats,
    })
  );
});

const getCategoryStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await generalService.getCategoryStats();

  res.status(httpStatus.OK).json(
    response({
      message: "Category stats retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: stats,
    })
  );
});

const getSubcategoryStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await generalService.getSubcategoryStats();

  res.status(httpStatus.OK).json(
    response({
      message: "Subcategory stats retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: stats,
    })
  );
});

const getTopJobs = asyncHandler(async (req: Request, res: Response) => {
  const jobs = await generalService.getTopJobs();

  res.status(httpStatus.OK).json(
    response({
      message: "Top jobs retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: jobs,
    })
  );
});

const getSeekerDashboardStats = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id;
  const stats = await generalService.getSeekerDashboardStats(userId as string);

  res.status(httpStatus.OK).json(
    response({
      message: "Seeker dashboard stats retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: stats,
    })
  );
});

const generalController = {
  getHeaderStats,
  getCategoryStats,
  getSubcategoryStats,
  getTopJobs,
  getSeekerDashboardStats,
};

export default generalController;
