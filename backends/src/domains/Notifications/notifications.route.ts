import { Router } from "express";
import notificationController from "./notifications.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Get all notifications for authenticated user
router.get("/", authMiddleware, notificationController.getUserNotifications);

// Get unread notifications for authenticated user
router.get(
  "/unread",
  authMiddleware,
  notificationController.getUserUnreadNotifications
);

// Get count of unread notifications
router.get(
  "/unread/count",
  authMiddleware,
  notificationController.getUnreadNotificationCount
);

// Mark a notification as read
router.patch(
  "/:id/read",
  authMiddleware,
  notificationController.markNotificationAsRead
);

// Mark all notifications as read
router.patch(
  "/read-all",
  authMiddleware,
  notificationController.markAllNotificationsAsRead
);

// Delete a notification (soft delete)
router.delete(
  "/:id",
  authMiddleware,
  notificationController.deleteNotification
);

// Create a new notification
router.post("/", authMiddleware, notificationController.createNotification);

export default router;
