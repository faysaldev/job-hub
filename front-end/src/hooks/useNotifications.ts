"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";

interface Notification {
  _id: string;
  title: string;
  link: string;
  sender?: { _id: string; name: string; email: string; image?: string };
  receiver: string;
  isRead: boolean;
  createdAt: string;
}

interface NotifMeta { total: number; totalPages: number; page: number; limit: number; }

/**
 * Real-time notifications hook via Socket.IO.
 * Replaces the old mock-data implementation.
 */
export const useNotifications = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meta, setMeta] = useState<NotifMeta>({ total: 0, totalPages: 1, page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!socket) return;

    socket.emit("notifications:get", { page: 1, limit: 10 });

    socket.on("notifications:loaded", ({ notifications: notifs, meta: m }: { notifications: Notification[]; meta: NotifMeta }) => {
      setNotifications(notifs);
      setMeta(m);
      setLoading(false);
    });

    socket.on("notification:new", ({ notification }: { notification: Notification }) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    socket.on("notification:updated", ({ notification }: { notification: Notification }) => {
      setNotifications((prev) => prev.map((n) => (n._id === notification._id ? notification : n)));
    });

    socket.on("notification:deleted", ({ notificationId }: { notificationId: string }) => {
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    });

    socket.on("notifications:allRead", () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });

    return () => {
      socket.off("notifications:loaded");
      socket.off("notification:new");
      socket.off("notification:updated");
      socket.off("notification:deleted");
      socket.off("notifications:allRead");
    };
  }, [socket]);

  const markAsRead = useCallback((id: string) => {
    socket?.emit("notification:read", { notificationId: id });
  }, [socket]);

  const markAllAsRead = useCallback(() => {
    socket?.emit("notification:readAll");
  }, [socket]);

  const deleteNotification = useCallback((id: string) => {
    socket?.emit("notification:delete", { notificationId: id });
  }, [socket]);

  return {
    notifications,
    meta,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};