import { Router } from "express";
import generalController from "./general.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Get header stats (Saved jobs, Unread notifications)
router.get(
  "/header-stats",
  authMiddleware,
  generalController.getHeaderStats
);

// Get job category statistics
router.get(
  "/category-stats",
  generalController.getCategoryStats
);

// Get job subcategory statistics
router.get(
  "/subcategory-stats",
  generalController.getSubcategoryStats
);

// Get top jobs (Trending or Latest)
router.get(
  "/top-jobs",
  generalController.getTopJobs
);

export default router;
