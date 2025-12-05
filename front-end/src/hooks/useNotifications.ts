import { useState, useEffect } from "react";

// Define the Notification interface based on the model schema
interface Notification {
  _id: string;
  title: string;
  link: string;
  sender: {
    id: string;
    name: string;
  };
  receiver: string;
  isRead: boolean;
  createdAt: string; // ISO date string
}

// Mock notifications data - in a real app, this would come from an API
const mockNotifications: Notification[] = [
  {
    _id: "1",
    title: "New job matching your preferences",
    link: "/jobs/123",
    sender: { id: "recruiter1", name: "Tech Company" },
    receiver: "1",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    _id: "2",
    title: "Application status update",
    link: "/applications/456",
    sender: { id: "recruiter2", name: "Global Inc" },
    receiver: "1",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    _id: "3",
    title: "Interview scheduled",
    link: "/interviews/789",
    sender: { id: "recruiter3", name: "Innovation Labs" },
    receiver: "1",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    _id: "4",
    title: "Welcome to JobHubs!",
    link: "/welcome",
    sender: { id: "admin", name: "JobHubs Admin" },
    receiver: "1",
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading notifications from an API
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Calculate unread count
    const count = notifications.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === id ? { ...notification, isRead: false } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const markAllAsUnread = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: false }))
    );
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
  };
};