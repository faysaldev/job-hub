import { Response } from "express";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import * as notificationService from "./notifications.service";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";

/**
 * Get all notifications for authenticated user
 */
const getUserNotifications = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { page = 1, limit = 10, includeDeleted = false } = req.query;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const notifications = await notificationService.getUserNotifications(
    userId,
    Number(page),
    Number(limit),
    includeDeleted === "true"
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Notifications retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: notifications,
    })
  );
});

/**
 * Get unread notifications for authenticated user
 */
const getUserUnreadNotifications = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const notifications = await notificationService.getUserUnreadNotifications(userId);

  res.status(httpStatus.OK).json(
    response({
      message: "Unread notifications retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: notifications,
    })
  );
});

/**
 * Mark a notification as read
 */
const markNotificationAsRead = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const notification = await notificationService.markAsRead(id, userId);

  if (!notification) {
    throw new AppError("Notification not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Notification marked as read successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: notification,
    })
  );
});

/**
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const result = await notificationService.markAllAsRead(userId);

  res.status(httpStatus.OK).json(
    response({
      message: "All notifications marked as read successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

/**
 * Delete a notification (soft delete)
 */
const deleteNotification = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const notification = await notificationService.deleteNotification(id, userId);

  if (!notification) {
    throw new AppError("Notification not found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Notification deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: notification,
    })
  );
});

/**
 * Get count of unread notifications
 */
const getUnreadNotificationCount = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  const count = await notificationService.getUnreadNotificationCount(userId);

  res.status(httpStatus.OK).json(
    response({
      message: "Unread notification count retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { count },
    })
  );
});

/**
 * Create a new notification
 */
const createNotification = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { title, link, receiver } = req.body;
  const sender = req.user?._id;

  if (!sender) {
    throw new AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }

  if (!title || !link || !receiver) {
    throw new AppError("Title, link, and receiver are required", httpStatus.BAD_REQUEST);
  }

  const newNotification = await notificationService.createNotification({
    title,
    link,
    sender,
    receiver,
  });

  res.status(httpStatus.CREATED).json(
    response({
      message: "Notification created successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: newNotification,
    })
  );
});

const notificationController = {
  getUserNotifications,
  getUserUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  createNotification,
};

export default notificationController;
