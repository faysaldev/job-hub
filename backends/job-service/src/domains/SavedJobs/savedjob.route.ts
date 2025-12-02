import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import savedJobController from "./savedjob.controller";

const router = Router();

// Protected routes for saved jobs (authentication required)
router.post("/", authMiddleware, savedJobController.saveJob); // Save a job
router.get("/", authMiddleware, savedJobController.getUserSavedJobs); // Get user's saved jobs
router.delete("/:jobId", authMiddleware, savedJobController.deleteSavedJob); // Remove a saved job

export default router;
