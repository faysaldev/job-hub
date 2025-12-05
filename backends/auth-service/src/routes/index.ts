import { Router } from "express";
import userRoutes from "../domains/User/user.route";
import authRoutes from "../domains/Auth/auth.route";
import jobSeekerRoutes from "../domains/Seeker/seeker.route";
import companyRoutes from "../domains/Company/company.route";
// Initialize the router
const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/job-seekers", jobSeekerRoutes);
router.use("/recruiter-company", companyRoutes);

export default router;
