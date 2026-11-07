import { Router } from "express";
import { authMiddleware, optionalAuth, requireRoles } from "../../middlewares/auth.middleware";
import jobController from "./job.controller";
import validate, { validateQuery } from "../../middlewares/validation.middleware";
import jobValidator from "./job.validation";

const router = Router();

// Public routes (no authentication required)
router.get(
  "/",
  validateQuery(jobValidator.searchJobsValidation),
  jobController.getAllJobs,
); // Get all jobs with optional filters
router.get(
  "/search",
  validateQuery(jobValidator.searchJobsValidation),
  jobController.searchJobs,
); // Search jobs
router.get("/author/:authorId", optionalAuth, jobController.getJobsByAuthorId); // Get jobs by author ID
router.get("/:jobId", optionalAuth, jobController.getJobById); // Get job by ID

// Protected routes (authentication required)
router.post(
  "/",
  authMiddleware,
  requireRoles("recruiter"),
  validate(jobValidator.createJobValidation),
  jobController.createJob,
); // Create a new job
router.put(
  "/:jobId",
  authMiddleware,
  requireRoles("recruiter"),
  validate(jobValidator.updateJobValidation),
  jobController.updateJob,
); // Update a job

router.delete("/:jobId", authMiddleware, requireRoles("recruiter"), jobController.deleteJob); // Delete a job

export default router;
