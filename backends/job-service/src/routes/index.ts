import { Router } from "express";
import jobRoutes from "../domains/Jobs/job.route";
import savedJobRoutes from "../domains/SavedJobs/savedjob.route";

// Initialize the router
const router = Router();

router.use("/job", jobRoutes);
router.use("/saved-jobs", savedJobRoutes);

export default router;
