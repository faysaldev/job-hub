import { Router } from "express";
import generalController from "./general.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validation.middleware";
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
  generalController.getSeekerDashboardStats,
);

// Get applied job IDs
router.get(
  "/applied-job-ids",
  authMiddleware,
  generalController.getAppliedJobIds,
);

// Submit contact form
router.post(
  "/contact",
  validate(generalValidation.contactFormValidation),
  generalController.submitContactForm,
);

export default router;
