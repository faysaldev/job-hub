"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
  Inbox,
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MailOpen,
  ArrowRight,
  MessageSquare,
  Briefcase,
  CheckCircle,
  Loader2,
  Shield,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import gsap from "gsap";
import { useSocket } from "@/src/hooks/useSocket";
import Link from "next/link";
import { toast } from "sonner";

interface NotifSender {
  _id: string;
  name: string;
  email: string;
  image?: string;
}
interface Notif {
  _id: string;
  title: string;
  link: string;
  sender?: NotifSender;
  isRead: boolean;
  createdAt: string;
}
interface Meta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

const NotificationsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Socket ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const fetchNotifs = () => {
      setIsLoading(true);
      socket.emit("notifications:get", { page: currentPage, limit });
    };

    fetchNotifs();

    // Re-fetch on connect/reconnect in case the socket was not ready initially
    socket.on("connect", fetchNotifs);

    socket.on(
      "notifications:loaded",
      ({
        notifications: notifs,
        meta: m,
      }: {
        notifications: Notif[];
        meta: Meta;
      }) => {
        setNotifications(notifs);
        setMeta(m);
        setIsLoading(false);
      },
    );

    // Real-time: new notification pushed from server
    socket.on(
      "notification:new",
      ({ notification }: { notification: Notif }) => {
        setNotifications((prev) => [notification, ...prev]);
        setMeta((m) => ({ ...m, total: m.total + 1 }));
        toast.info(notification.title);
      },
    );

    // After mark-read
    socket.on(
      "notification:updated",
      ({ notification }: { notification: Notif }) => {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? notification : n)),
        );
      },
    );

    // After delete
    socket.on(
      "notification:deleted",
      ({ notificationId }: { notificationId: string }) => {
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId),
        );
        setMeta((m) => ({ ...m, total: Math.max(0, m.total - 1) }));
      },
    );

    // After mark-all-read
    socket.on("notifications:allRead", () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });

    socket.on("socket:error", ({ message }: { message: string }) => {
      toast.error(message);
      setIsLoading(false);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket] connection error:", err.message);
      setIsLoading(false);
    });

    return () => {
      socket.off("connect", fetchNotifs);
      socket.off("notifications:loaded");
      socket.off("notification:new");
      socket.off("notification:updated");
      socket.off("notification:deleted");
      socket.off("notifications:allRead");
      socket.off("socket:error");
      socket.off("connect_error");
    };
  }, [socket, currentPage]);

  // ── GSAP animations ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || notifications.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".notif-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
      gsap.fromTo(
        ".notif-item",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          delay: 0.2,
          ease: "power2.out",
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [isLoading, notifications.length]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleMarkRead = useCallback(
    (id: string) => {
      socket?.emit("notification:read", { notificationId: id });
    },
    [socket],
  );

  const handleMarkAllRead = useCallback(() => {
    socket?.emit("notification:readAll");
  }, [socket]);

  const handleDelete = useCallback(
    (id: string) => {
      socket?.emit("notification:delete", { notificationId: id });
    },
    [socket],
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatDate = (iso: string) => {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("message")) return MessageSquare;
    if (t.includes("job") || t.includes("application")) return Briefcase;
    if (t.includes("interview")) return CheckCircle;
    return Bell;
  };

  return (
    <div ref={containerRef} className="min-h-screen jobhub-page-bg pt-10 pb-0">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="notif-header mb-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#234C6A] p-8 text-white shadow-2xl shadow-[#234C6A]/20 md:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/15 to-transparent" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-sm">
                  <Bell className="h-8 w-8" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-4 ring-[#234C6A]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <Badge className="mb-3 rounded-full border-white/15 bg-white/10 text-white">
                    <Shield className="mr-2 h-4 w-4" />
                    Activity center
                  </Badge>
                  <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                    Notifications
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
                    Stay updated with application changes, messages, interviews,
                    and account activity in real time.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="h-12 rounded-2xl bg-white px-6 font-black text-[#234C6A] shadow-lg transition-all hover:bg-[#E3E3E3] active:scale-95 disabled:opacity-50"
              >
                <CheckCheck className="mr-2 h-5 w-5" />
                Mark All Read
              </Button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-[2rem] border border-[#234C6A]/10 bg-white/90 shadow-xl shadow-[#234C6A]/10 backdrop-blur">
          <div className="flex items-center justify-between border-b border-[#E3E3E3] bg-[#F8FAFC] p-6 md:p-8">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#234C6A]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#234C6A]/10">
                <Inbox className="h-6 w-6 text-[#234C6A]" />
              </span>
              Notification Center
            </h2>
            {unreadCount > 0 && (
              <Badge className="rounded-full border-none bg-[#234C6A] px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                {unreadCount} New
              </Badge>
            )}
          </div>

          <div className="divide-y divide-[#E3E3E3]/70">
            {isLoading ? (
              <div className="text-center py-20">
                <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#234C6A]" />
                <p className="text-sm font-black uppercase tracking-widest text-[#234C6A]">
                  Loading Notifications...
                </p>
                <p className="mt-2 text-sm text-[#456882]">
                  Syncing your real-time activity center
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-32">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#234C6A]/10">
                  <BellOff className="h-12 w-12 text-[#234C6A]/35" />
                </div>
                <h3 className="text-2xl font-black text-[#234C6A]">
                  No notifications found
                </h3>
                <p className="mx-auto mt-2 max-w-sm font-medium text-[#456882]">
                  We&apos;ll let you know when something important happens.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = getIcon(n.title);
                return (
                  <div
                    key={n._id}
                    className={cn(
                      "notif-item group relative flex items-start gap-5 p-6 transition-all duration-300 hover:bg-[#F8FAFC] md:p-8",
                      !n.isRead && "bg-[#234C6A]/5",
                    )}
                  >
                    {!n.isRead && (
                      <div className="absolute bottom-0 left-0 top-0 w-1.5 rounded-r-full bg-gradient-to-b from-[#234C6A] to-[#456882]" />
                    )}

                    <div className="relative flex-shrink-0">
                      <div
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 md:h-16 md:w-16",
                          n.isRead
                            ? "border border-[#234C6A]/10 bg-white text-[#456882]"
                            : "bg-gradient-to-br from-[#234C6A] to-[#456882] text-white",
                        )}
                      >
                        {n.sender?.image ? (
                          <img
                            src={n.sender.image}
                            alt=""
                            className="h-full w-full rounded-2xl object-cover"
                          />
                        ) : (
                          <Icon className="h-7 w-7" />
                        )}
                      </div>
                      {!n.isRead && (
                        <span className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full border-4 border-white bg-[#234C6A]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <h3
                          className={cn(
                            "truncate pr-4 text-lg tracking-tight",
                            n.isRead
                              ? "font-bold text-[#456882]"
                              : "font-black text-[#234C6A]",
                          )}
                        >
                          {n.link ? (
                            <Link href={n.link} className="hover:underline">
                              {n.title}
                            </Link>
                          ) : (
                            n.title
                          )}
                        </h3>
                        <span className="flex shrink-0 items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#456882]/70">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(n.createdAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-4 mt-4">

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkRead(n._id)}
                            disabled={n.isRead}
                            className={cn(
                              "h-10 w-10 rounded-xl transition-all",
                              n.isRead
                                ? "text-[#456882]/35 cursor-not-allowed"
                                : "text-[#234C6A] hover:bg-[#234C6A]/10",
                            )}
                            title={n.isRead ? "Already read" : "Mark as read"}
                          >
                            {n.isRead ? (
                              <MailOpen className="h-5 w-5" />
                            ) : (
                              <Mail className="h-5 w-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(n._id)}
                            className="h-10 w-10 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete notification"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 border-t border-[#E3E3E3] bg-[#F8FAFC] p-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="h-12 w-12 rounded-2xl border-[#234C6A]/10 bg-white text-[#234C6A] shadow-sm hover:bg-[#234C6A]/5 disabled:opacity-30"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <span className="font-black text-[#234C6A] tracking-widest text-sm uppercase">
                Page {currentPage} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === meta.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-12 w-12 rounded-2xl border-[#234C6A]/10 bg-white text-[#234C6A] shadow-sm hover:bg-[#234C6A]/5 disabled:opacity-30"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
