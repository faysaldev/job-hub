"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Bell, BellOff, CheckCheck, Inbox, Sparkles, Trash2,
  ChevronLeft, ChevronRight, Clock, Mail, MailOpen,
  ArrowRight, MessageSquare, Briefcase, CheckCircle, Loader2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import gsap from "gsap";
import { useSocket } from "@/src/hooks/useSocket";
import Link from "next/link";
import { toast } from "sonner";

interface NotifSender { _id: string; name: string; email: string; image?: string; }
interface Notif { _id: string; title: string; link: string; sender?: NotifSender; isRead: boolean; createdAt: string; }
interface Meta { total: number; totalPages: number; page: number; limit: number; }

const NotificationsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, totalPages: 1, page: 1, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // ── Socket ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    socket.emit("notifications:get", { page: currentPage, limit });

    socket.on("notifications:loaded", ({ notifications: notifs, meta: m }: { notifications: Notif[]; meta: Meta }) => {
      setNotifications(notifs);
      setMeta(m);
      setIsLoading(false);
    });

    // Real-time: new notification pushed from server
    socket.on("notification:new", ({ notification }: { notification: Notif }) => {
      setNotifications(prev => [notification, ...prev]);
      setMeta(m => ({ ...m, total: m.total + 1 }));
      toast.info(notification.title);
    });

    // After mark-read
    socket.on("notification:updated", ({ notification }: { notification: Notif }) => {
      setNotifications(prev => prev.map(n => n._id === notification._id ? notification : n));
    });

    // After delete
    socket.on("notification:deleted", ({ notificationId }: { notificationId: string }) => {
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setMeta(m => ({ ...m, total: Math.max(0, m.total - 1) }));
    });

    // After mark-all-read
    socket.on("notifications:allRead", () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    });

    socket.on("socket:error", ({ message }: { message: string }) => toast.error(message));

    return () => {
      socket.off("notifications:loaded");
      socket.off("notification:new");
      socket.off("notification:updated");
      socket.off("notification:deleted");
      socket.off("notifications:allRead");
      socket.off("socket:error");
    };
  }, [socket, currentPage]);

  // Re-fetch when page changes
  useEffect(() => {
    if (!socket) return;
    setIsLoading(true);
    socket.emit("notifications:get", { page: currentPage, limit });
  }, [currentPage, socket]);

  // ── GSAP animations ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || notifications.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".notif-header", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      gsap.fromTo(".notif-item", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, delay: 0.3, ease: "power2.out" });
    }, containerRef);
    return () => ctx.revert();
  }, [isLoading, notifications.length]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleMarkRead = useCallback((id: string) => {
    socket?.emit("notification:read", { notificationId: id });
  }, [socket]);

  const handleMarkAllRead = useCallback(() => {
    socket?.emit("notification:readAll");
  }, [socket]);

  const handleDelete = useCallback((id: string) => {
    socket?.emit("notification:delete", { notificationId: id });
  }, [socket]);

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

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#234C6A] animate-spin mb-4" />
        <p className="text-[#234C6A] font-bold uppercase tracking-widest text-sm">Loading Notifications...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="notif-header mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center shadow-xl text-white relative">
                <Bell className="h-8 w-8" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-black text-[#234C6A] tracking-tight">Notifications</h1>
                <p className="text-[#456882] font-medium mt-1">Stay updated with your latest activities</p>
              </div>
            </div>
            <Button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="h-12 px-6 rounded-2xl bg-white text-[#234C6A] hover:bg-blue-50 border border-gray-100 shadow-sm font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCheck className="h-5 w-5" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total", value: meta.total, icon: Inbox, color: "from-blue-50 to-white" },
            { label: "Unread", value: unreadCount, icon: Sparkles, color: "from-amber-50 to-white" },
            { label: "Updates", value: "Real-time", icon: Bell, color: "from-emerald-50 to-white" },
          ].map((stat, i) => (
            <Card key={i} className={cn("p-6 border-none shadow-lg rounded-[32px] bg-gradient-to-br", stat.color)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-[#234C6A]" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-[#234C6A]">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* List */}
        <Card className="border-none bg-white shadow-2xl rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <h2 className="text-xl font-black text-[#234C6A] flex items-center gap-3">
              <Inbox className="h-6 w-6 text-blue-500" />
              Notification Center
            </h2>
            {unreadCount > 0 && (
              <Badge className="bg-blue-600 text-white border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
                {unreadCount} New
              </Badge>
            )}
          </div>

          <div className="divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="text-center py-32">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <BellOff className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-[#234C6A]">No notifications found</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">We'll let you know when something important happens.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = getIcon(n.title);
                return (
                  <div
                    key={n._id}
                    className={cn("notif-item group p-8 flex items-start gap-6 transition-all duration-300 hover:bg-gray-50/50 relative", !n.isRead && "bg-blue-50/30")}
                  >
                    {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full" />}

                    <div className="relative flex-shrink-0">
                      <div className={cn("w-16 h-16 rounded-[22px] flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110", n.isRead ? "bg-white text-gray-400" : "bg-gradient-to-br from-[#234C6A] to-[#456882] text-white shadow-blue-900/10")}>
                        {n.sender?.image ? (
                          <img src={n.sender.image} alt="" className="w-full h-full object-cover rounded-[22px]" />
                        ) : (
                          <Icon className="h-7 w-7" />
                        )}
                      </div>
                      {!n.isRead && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-4 border-white rounded-full animate-pulse" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <h3 className={cn("text-lg tracking-tight truncate pr-4", n.isRead ? "text-gray-500 font-bold" : "text-[#234C6A] font-black")}>
                          {n.title}
                        </h3>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(n.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <Link href={n.link || "#"}>
                          <Button size="sm" className="h-10 px-6 rounded-xl bg-[#234C6A] hover:bg-blue-600 text-white font-black text-xs shadow-lg transition-all active:scale-95">
                            View Activity
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => handleMarkRead(n._id)}
                            disabled={n.isRead}
                            className={cn("h-10 w-10 rounded-xl transition-all", n.isRead ? "text-gray-300" : "text-blue-500 hover:bg-blue-50")}
                            title={n.isRead ? "Already read" : "Mark as read"}
                          >
                            {n.isRead ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => handleDelete(n._id)}
                            className="h-10 w-10 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50"
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
            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-center gap-4">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                className="h-12 w-12 rounded-2xl border-gray-100 bg-white text-[#234C6A] hover:bg-blue-50 shadow-sm disabled:opacity-30">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <span className="font-black text-[#234C6A] tracking-widest text-sm uppercase">
                Page {currentPage} of {meta.totalPages}
              </span>
              <Button variant="outline" disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage(p => p + 1)}
                className="h-12 w-12 rounded-2xl border-gray-100 bg-white text-[#234C6A] hover:bg-blue-50 shadow-sm disabled:opacity-30">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
