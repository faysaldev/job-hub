import { Request, Response } from "express";
import {
  createCompanyService,
  getAllCompaniesService,
  getCompanyByUserIdService,
  updateCompanyByUserIdService,
} from "./company.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const companyData = req.body;
  const protectedReq = req as ProtectedRequest;

  if (protectedReq.user) {
    companyData.userId = protectedReq.user._id;
  }

  const company = await createCompanyService(companyData);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Company created successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: company,
    })
  );
});

export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const protectedReq = req as ProtectedRequest;

  if (!protectedReq.user?._id) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const company = await getCompanyByUserIdService(protectedReq.user._id);

  if (!company) {
    throw new AppError("Company profile not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Company retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: company,
    })
  );
});

export const getAllCompanies = asyncHandler(async (req: Request, res: Response) => {
  const companies = await getAllCompaniesService();

  res.status(httpStatus.OK).json(
    response({
      message: "Companies retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: companies,
    })
  );
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const protectedReq = req as ProtectedRequest;

  if (!protectedReq.user?._id) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const companyData = req.body;
  const updatedCompany = await updateCompanyByUserIdService(protectedReq.user._id, companyData);

  if (!updatedCompany) {
    throw new AppError("Company profile not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Company updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updatedCompany,
    })
  );
});
