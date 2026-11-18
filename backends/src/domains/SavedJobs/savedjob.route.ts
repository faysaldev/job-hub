import { Router } from "express";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import savedJobController from "./savedjob.controller";
import searches from "./savedsearch.controller";
import validate from "../../middlewares/validation.middleware";
import { z } from "zod";
import * as follows from "./company-follow.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
const filter = z.object({ q: z.string().trim().max(100).optional(), category: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(), type: z.string().trim().max(50).optional(),
  locationType: z.enum(["remote", "onsite", "hybrid"]).optional() });
const createSearch = z.object({ name: z.string().trim().min(1).max(80), filters: filter,
  alertsEnabled: z.boolean().optional(), frequency: z.enum(["daily", "weekly"]).optional() });
const updateSearch = createSearch.partial();

const router = Router();

// Saved searches share the existing saved-jobs resource rather than creating another API family.
router.get("/searches", authMiddleware, requireRoles("seeker"), searches.list);
router.post("/searches", authMiddleware, requireRoles("seeker"), validate(createSearch), searches.create);
router.patch("/searches/:id", authMiddleware, requireRoles("seeker"), validate(updateSearch), searches.update);
router.delete("/searches/:id", authMiddleware, requireRoles("seeker"), searches.remove);
// Followed employers reuse saved-jobs rather than adding a separate API family.
router.get("/companies", authMiddleware, requireRoles("seeker"), asyncHandler(async (req: ProtectedRequest, res) => {
  const data = await follows.listFollowedCompanies(req.user!._id);
  res.json(response({ message: "Followed employers", status: "OK", statusCode: 200, data }));
}));
router.patch("/companies/:companyId", authMiddleware, requireRoles("seeker"), validate(z.object({ following: z.boolean() })),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const data = await follows.setCompanyFollow(req.user!._id, req.params.companyId, req.body.following);
    res.json(response({ message: "Employer follow updated", status: "OK", statusCode: 200, data }));
  }));
// Protected routes for saved jobs (authentication required)
router.post("/", authMiddleware, requireRoles("seeker"), savedJobController.saveJob); // Save a job
router.get("/", authMiddleware, requireRoles("seeker"), savedJobController.getUserSavedJobs); // Get user's saved jobs
router.delete("/:jobId", authMiddleware, requireRoles("seeker"), savedJobController.deleteSavedJob); // Remove a saved job

export default router;
