"use client";

import { useEffect, useRef } from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
  Filter,
  Settings,
  Sparkles,
  Inbox,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import NotificationItem from "@/src/components/notifications/NotificationItem";
import { useNotifications } from "@/src/hooks/useNotifications";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import gsap from "gsap";

const NotificationsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".notification-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".notification-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );

      gsap.fromTo(
        ".notification-item",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          delay: 0.4,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3E3E3]">
        <Header />
        <main className="flex-grow py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#234C6A] border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-[#234C6A] text-lg font-medium">Loading notifications...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-grow py-8">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="notification-header mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#234C6A]">Notifications</h1>
                    {unreadCount > 0 && (
                      <p className="text-[#456882]">
                        You have <span className="font-semibold text-[#234C6A]">{unreadCount}</span> unread notification{unreadCount !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  size="sm"
                  className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white disabled:opacity-50"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <Bell className="h-5 w-5" />,
                label: "Total",
                value: notifications.length,
                color: "from-[#234C6A] to-[#456882]",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                label: "Unread",
                value: unreadCount,
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: <CheckCheck className="h-5 w-5" />,
                label: "Read",
                value: notifications.length - unreadCount,
                color: "from-green-500 to-emerald-500",
              },
            ].map((stat, i) => (
              <Card key={i} className="p-4 border-none bg-white shadow-md">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm text-[#456882]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#234C6A]">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Notifications List */}
          <Card className="notification-card border-none bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-[#E3E3E3] bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-[#234C6A]" />
                  <h2 className="text-lg font-semibold text-[#234C6A]">All Notifications</h2>
                </div>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-[#234C6A] text-white text-xs font-semibold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>

            {/* Notifications Content */}
            <div className="p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-[#E3E3E3] flex items-center justify-center mx-auto mb-6">
                    <BellOff className="h-10 w-10 text-[#456882]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#234C6A] mb-2">
                    No Notifications Yet
                  </h3>
                  <p className="text-[#456882] max-w-sm mx-auto">
                    When you receive notifications about job applications, messages, or updates, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={notification._id} className="notification-item">
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onMarkAsUnread={markAsUnread}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Card Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-[#E3E3E3] bg-[#E3E3E3]/30 text-center">
                <p className="text-sm text-[#456882]">
                  Showing all {notifications.length} notifications
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
