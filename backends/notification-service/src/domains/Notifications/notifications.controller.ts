import { Request, Response } from "express";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import * as notificationService from "./notifications.service";
import { handleError } from "../../lib/errorsHandle";

/**
 * Get all notifications for authenticated user
 */
const getUserNotifications = async (req: ProtectedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, includeDeleted = false } = req.query;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: null,
        })
      );
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
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

/**
 * Get unread notifications for authenticated user
 */
const getUserUnreadNotifications = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: null,
        })
      );
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
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

/**
 * Get a single notification by ID
 */
const getNotificationById = async (req: ProtectedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: null,
        })
      );
    }

    const notification = await notificationService.getNotificationById(id, userId);

    if (!notification) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Notification not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: null,
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Notification retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: notification,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

/**
 * Mark a notification as read
 */
const markNotificationAsRead = async (req: ProtectedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: null,
        })
      );
    }

    const notification = await notificationService.markAsRead(id, userId);

    if (!notification) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Notification not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: null,
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Notification marked as read successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: notification,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

/**
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: null,
        })
      );
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
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

/**
 * Delete a notification (soft delete)
 */
const deleteNotification = async (req: ProtectedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: null,
        })
      );
    }

    const notification = await notificationService.deleteNotification(id, userId);

    if (!notification) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Notification not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: null,
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Notification deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: notification,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

/**
 * Get count of unread notifications
 */
const getUnreadNotificationCount = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "User not authenticated",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
          data: null,
        })
      );
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
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: handledError.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

const notificationController = {
  getUserNotifications,
  getUserUnreadNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
};

export default notificationController;
