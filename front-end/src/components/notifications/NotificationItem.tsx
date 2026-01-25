import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  ExternalLink,
  Mail,
  MailOpen,
  User,
  Clock,
  Bell,
  Briefcase,
  MessageSquare,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

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

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
}: NotificationItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  // Determine notification type based on title content
  const getNotificationIcon = () => {
    const title = notification.title.toLowerCase();
    if (title.includes("application") || title.includes("job")) {
      return Briefcase;
    } else if (title.includes("message")) {
      return MessageSquare;
    } else if (title.includes("accepted") || title.includes("approved")) {
      return CheckCircle;
    }
    return Bell;
  };

  const NotificationIcon = getNotificationIcon();

  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md group ${
        notification.isRead
          ? "border-[#E3E3E3] bg-white hover:border-[#234C6A]/20"
          : "border-[#234C6A]/30 bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            notification.isRead
              ? "bg-[#E3E3E3]"
              : "bg-gradient-to-br from-[#234C6A] to-[#456882]"
          }`}
        >
          <NotificationIcon
            className={`h-6 w-6 ${
              notification.isRead ? "text-[#456882]" : "text-white"
            }`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={`font-semibold truncate ${
                    notification.isRead ? "text-[#456882]" : "text-[#234C6A]"
                  }`}
                >
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <Badge className="bg-[#234C6A] text-white border-none text-xs px-2 py-0.5 flex-shrink-0">
                    New
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-[#456882]">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {notification.sender.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#456882]" />
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(notification.createdAt)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (notification.isRead) {
                    onMarkAsUnread(notification._id);
                  } else {
                    onMarkAsRead(notification._id);
                  }
                }}
                className={`h-9 w-9 ${
                  notification.isRead
                    ? "text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/10"
                    : "text-[#234C6A] hover:bg-[#234C6A]/10"
                }`}
                title={notification.isRead ? "Mark as unread" : "Mark as read"}
              >
                {notification.isRead ? (
                  <MailOpen className="h-4 w-4" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>

              <Link href={notification.link}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Unread indicator line */}
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#234C6A] to-[#456882] rounded-l-xl" />
      )}
    </div>
  );
};

export default NotificationItem;
