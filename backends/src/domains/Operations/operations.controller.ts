import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { adminActions, recordQuery, reportInput } from "./operations.validation";
import * as service from "./operations.services";

const ok = (res: Response, data: unknown, message = "OK", statusCode = 200) =>
  res.status(statusCode).json(response({ message, status: "OK", statusCode, data: data as object }));
const requestId = (req: ProtectedRequest) => req.res?.locals?.requestId as string | undefined;

const overview = asyncHandler(async (_req: ProtectedRequest, res: Response) => ok(res, await service.adminOverview()));
const records = asyncHandler(async (req: ProtectedRequest, res: Response) =>
  ok(res, await service.adminRecords(recordQuery.parse(req.query))));
const action = asyncHandler(async (req: ProtectedRequest, res: Response) =>
  ok(res, await service.adminAction(req.user!._id, adminActions.parse(req.body), requestId(req)), "Action completed"));
const report = asyncHandler(async (req: ProtectedRequest, res: Response) =>
  ok(res, await service.submitReport(req.user!._id, reportInput.parse(req.body)), "Report received", 201));
const recruiter = asyncHandler(async (req: ProtectedRequest, res: Response) =>
  ok(res, await service.recruiterAnalytics(req.user!._id)));
export default { overview, records, action, report, recruiter };
