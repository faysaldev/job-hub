import { Router } from "express";
import notificationController from "./notifications.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * GET /notifications/unread/count
 * Still a REST endpoint — used by the header stats query for the unread badge.
 * All other notification operations (list, mark-read, delete) are handled via
 * Socket.IO events to keep the UI fully real-time.
 */
router.get(
  "/unread/count",
  authMiddleware,
  notificationController.getUnreadNotificationCount,
);

export default router;
