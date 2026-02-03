import { Router } from "express";
// Auth Service domains
import userRoutes from "../domains/User/user.route";
import authRoutes from "../domains/Auth/auth.route";
import jobSeekerRoutes from "../domains/Seeker/seeker.route";
import companyRoutes from "../domains/Company/company.route";
// Job Service domains
import jobRoutes from "../domains/Jobs/job.route";
import savedJobRoutes from "../domains/SavedJobs/savedjob.route";
// Application Service domains
import applicationRoutes from "../domains/Applications/application.route";
import stripeRoutes from "../domains/Stripe/stripe.route";
// Message Queue domains
import conversationsRoutes from "../domains/Conversations/conversations.route";
import messageRoutes from "../domains/Messages/message.route";
// Notification Service domains
import notificationRoutes from "../domains/Notifications/notifications.route";

// Initialize the router
const router = Router();

// Auth routes
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/job-seekers", jobSeekerRoutes);
router.use("/recruiter-company", companyRoutes);
// Job routes
router.use("/job", jobRoutes);
router.use("/saved-jobs", savedJobRoutes);
// Application routes
router.use("/applications", applicationRoutes);
router.use("/stripe", stripeRoutes);
// Message routes
router.use("/conversations", conversationsRoutes);
router.use("/messages", messageRoutes);
// Notification routes
router.use("/notifications", notificationRoutes);

export default router;
