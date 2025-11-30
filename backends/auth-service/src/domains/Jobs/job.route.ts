import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import jobController from "./job.controller";

const router = Router();

// Public routes (no authentication required)
router.get("/", jobController.getAllJobs);           // Get all jobs with optional filters
router.get("/search", jobController.searchJobs);    // Search jobs
router.get("/:jobId", jobController.getJobById);    // Get job by ID
router.get("/type/:jobType", jobController.getJobsByType);         // Get jobs by type
router.get("/experience/:experience", jobController.getJobsByExperience); // Get jobs by experience level

// Protected routes (authentication required)
router.post("/", authMiddleware, jobController.createJob);          // Create a new job
router.put("/:jobId", authMiddleware, jobController.updateJob);     // Update a job
router.delete("/:jobId", authMiddleware, jobController.deleteJob);  // Delete a job

export default router;
