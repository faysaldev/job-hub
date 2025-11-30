import { Router } from "express";
import jobRoutes from "../domains/Jobs/job.route";

// Initialize the router
const router = Router();

router.use("/job", jobRoutes);

export default router;
