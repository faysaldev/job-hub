import { Router } from "express";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import savedJobController from "./savedjob.controller";
import searches from "./savedsearch.controller";
import validate from "../../middlewares/validation.middleware";
import { z } from "zod";
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
// Protected routes for saved jobs (authentication required)
router.post("/", authMiddleware, requireRoles("seeker"), savedJobController.saveJob); // Save a job
router.get("/", authMiddleware, requireRoles("seeker"), savedJobController.getUserSavedJobs); // Get user's saved jobs
router.delete("/:jobId", authMiddleware, requireRoles("seeker"), savedJobController.deleteSavedJob); // Remove a saved job

export default router;
