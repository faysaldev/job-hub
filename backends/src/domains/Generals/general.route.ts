import { Router } from "express";
import generalController from "./general.controller";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validation.middleware";
import { rateLimit } from "../../middlewares/rateLimit.middleware";
import generalValidation from "./general.validation";

const router = Router();

// Get header stats (Saved jobs, Unread notifications)
router.get("/header-stats", authMiddleware, generalController.getHeaderStats);

// Get job category statistics
router.get("/category-stats", generalController.getCategoryStats);

// Get job subcategory statistics
router.get("/subcategory-stats", generalController.getSubcategoryStats);

// Get top jobs (Trending or Latest)
router.get("/top-jobs", generalController.getTopJobs);

// Get seeker dashboard stats
router.get(
  "/seeker-dashboard-stats",
  authMiddleware,
  requireRoles("seeker"),
  generalController.getSeekerDashboardStats,
);

// Get applied job IDs
router.get(
  "/applied-job-ids",
  authMiddleware,
  requireRoles("seeker"),
  generalController.getAppliedJobIds,
);

// Get saved job IDs
router.get("/saved-job-ids", authMiddleware, requireRoles("seeker"), generalController.getSavedJobIds);

// Submit contact form
router.post(
  "/contact",
  rateLimit(5, 15 * 60, "contact"),
  validate(generalValidation.contactFormValidation),
  generalController.submitContactForm,
);

// Get recruiter dashboard stats
router.get(
  "/recruiter-dashboard-stats",
  authMiddleware,
  requireRoles("recruiter"),
  generalController.getRecruiterDashboardStats,
);

export default router;
