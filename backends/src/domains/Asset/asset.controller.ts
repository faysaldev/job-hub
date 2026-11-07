import { Response } from "express";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { AppError } from "../../lib/errors";
import { ProtectedRequest } from "../../types/protected-request";
import { confirmUpload, getAssetAccess, initiateUpload, uploadLegacyImage } from "./asset.services";

const send = (res: Response, data: object, message: string, statusCode = 200) =>
  res.status(statusCode).json(response({ message, status: "OK", statusCode, data }));

const initiate = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const kind = req.body.kind;
  if ((kind === "resume" && req.user?.role !== "seeker") ||
      (kind === "company-logo" && req.user?.role !== "recruiter")) {
    throw new AppError("File purpose is not allowed for this account", 403);
  }
  const result = await initiateUpload(req.user!._id, req.body);
  res.setHeader("Cache-Control", "no-store");
  send(res, result, "Upload URL created", 201);
});
const complete = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  send(res, await confirmUpload(req.user!._id, req.params.id), "Upload confirmed");
});
const access = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  res.setHeader("Cache-Control", "private, no-store");
  send(res, await getAssetAccess(req.params.id, req.user!._id, req.user!.role), "File URL created");
});
const legacyUpload = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  if (!req.file) throw new AppError("Image is required", 400);
  send(res, await uploadLegacyImage(req.user!._id, "avatar", req.file), "Image uploaded");
});
export default { initiate, complete, access, legacyUpload };
