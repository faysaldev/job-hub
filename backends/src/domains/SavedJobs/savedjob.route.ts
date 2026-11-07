import { Router } from "express";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import savedJobController from "./savedjob.controller";

const router = Router();

// Protected routes for saved jobs (authentication required)
router.post("/", authMiddleware, requireRoles("seeker"), savedJobController.saveJob); // Save a job
router.get("/", authMiddleware, requireRoles("seeker"), savedJobController.getUserSavedJobs); // Get user's saved jobs
router.delete("/:jobId", authMiddleware, requireRoles("seeker"), savedJobController.deleteSavedJob); // Remove a saved job

export default router;
