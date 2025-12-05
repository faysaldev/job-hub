import { Types } from "mongoose";
import Notification from "./notifications.model";
import { INotification } from "./notifications.model";

/**
 * Create a new notification
 */
export const createNotification = async (input: {
  title: string;
  link: string;
  sender: string | Types.ObjectId;
  receiver: string | Types.ObjectId;
}): Promise<INotification> => {
  try {
    const { title, link, sender, receiver } = input;

    const notification = new Notification({
      title,
      link,
      sender,
      receiver,
    });

    return await notification.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Get all notifications for a specific user
 */
export const getUserNotifications = async (
  userId: string | Types.ObjectId,
  page: number = 1,
  limit: number = 10,
  includeDeleted: boolean = false
): Promise<{
  notifications: INotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  try {
    const skip = (page - 1) * limit;

    const query: any = { receiver: userId };
    if (!includeDeleted) {
      query.isDeleted = { $ne: true }; // Use $ne to check for not true or undefined
    }

    const notifications = await Notification.find(query)
      .populate("sender", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get all unread notifications for a specific user
 */
export const getUserUnreadNotifications = async (
  userId: string | Types.ObjectId
): Promise<INotification[]> => {
  try {
    return await Notification.find({
      receiver: userId,
      isRead: false,
      isDeleted: { $ne: true },
    })
      .populate("sender", "name email image")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (
  notificationId: string | Types.ObjectId,
  userId: string | Types.ObjectId
): Promise<INotification | null> => {
  try {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, receiver: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (
  userId: string | Types.ObjectId
): Promise<{ modifiedCount: number }> => {
  try {
    const result = await Notification.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return { modifiedCount: result.modifiedCount };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a notification (soft delete)
 */
export const deleteNotification = async (
  notificationId: string | Types.ObjectId,
  userId: string | Types.ObjectId
): Promise<INotification | null> => {
  try {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, receiver: userId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Permanently delete notifications
 */
export const permanentDeleteNotification = async (
  notificationId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<boolean> => {
  try {
    const result = await Notification.deleteOne({
      _id: notificationId,
      receiver: userId,
    });
    return result.deletedCount === 1;
  } catch (error) {
    throw error;
  }
};

/**
 * Get count of unread notifications for a user
 */
export const getUnreadNotificationCount = async (
  userId: string | Types.ObjectId
): Promise<number> => {
  try {
    return await Notification.countDocuments({
      receiver: userId,
      isRead: false,
      isDeleted: { $ne: true },
    });
  } catch (error) {
    throw error;
  }
};
