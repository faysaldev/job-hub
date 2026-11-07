import { Response } from "express";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import { assertId } from "../../lib/query";
import { AppError } from "../../lib/errors";
import SavedSearch from "./savedsearch.model";
const ok = (res: Response, message: string, data: unknown, statusCode = 200) =>
  res.status(statusCode).json(response({ message, status: "OK", statusCode, data: data as object }));
const list = asyncHandler(async (req: ProtectedRequest, res: Response) => ok(res, "Saved searches retrieved",
  await SavedSearch.find({ userId: req.user!._id }).sort({ createdAt: -1 }).limit(30).lean()));
const create = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  if (await SavedSearch.countDocuments({ userId: req.user!._id }) >= 30) throw new AppError("Maximum 30 saved searches", 409);
  const saved = await SavedSearch.create({ ...req.body, userId: req.user!._id });
  ok(res, "Saved search created", saved, 201);
});
const update = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const saved = await SavedSearch.findOneAndUpdate({ _id: assertId(req.params.id), userId: req.user!._id },
    { $set: req.body }, { new: true, runValidators: true });
  if (!saved) throw new AppError("Saved search not found", 404);
  ok(res, "Saved search updated", saved);
});
const remove = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const saved = await SavedSearch.findOneAndDelete({ _id: assertId(req.params.id), userId: req.user!._id });
  if (!saved) throw new AppError("Saved search not found", 404);
  ok(res, "Saved search deleted", { deleted: true });
});
export default { list, create, update, remove };
