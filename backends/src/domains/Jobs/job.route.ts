import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import jobController from "./job.controller";
import validate from "../../middlewares/validation.middleware";
import jobValidator from "./job.validation";

const router = Router();

// Public routes (no authentication required)
router.get("/", validate(jobValidator.searchJobsValidation), jobController.getAllJobs); // Get all jobs with optional filters
router.get("/search", validate(jobValidator.searchJobsValidation), jobController.searchJobs); // Search jobs
router.get("/:jobId", jobController.getJobById); // Get job by ID

// Protected routes (authentication required)
router.post(
  "/",
  authMiddleware,
  validate(jobValidator.createJobValidation),
  jobController.createJob,
); // Create a new job
router.put(
  "/:jobId",
  authMiddleware,
  validate(jobValidator.updateJobValidation),
  jobController.updateJob,
); // Update a job
router.delete("/:jobId", authMiddleware, jobController.deleteJob); // Delete a job

export default router;
