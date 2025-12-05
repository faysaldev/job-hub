"use client";

import { Bell } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import NotificationItem from "@/src/components/notifications/NotificationItem";
import { useNotifications } from "@/src/hooks/useNotifications";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
  } = useNotifications();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3E3E3] flex items-center justify-center">
        <div className="text-[#234C6A]">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#E3E3E3] py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#234C6A] to-[#456882] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-8 w-8" />
                  <h1 className="text-2xl font-bold">Notifications</h1>
                </div>
                <Button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="bg-white text-[#234C6A] hover:bg-[#E3E3E3]"
                >
                  Mark All as Read
                </Button>
              </div>
              {unreadCount > 0 && (
                <p className="mt-2 text-[#E3E3E3]">
                  You have {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No notifications
                  </h3>
                  <p className="mt-1 text-gray-500">
                    You don{`'`}t have any notifications at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onMarkAsUnread={markAsUnread}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPage;
