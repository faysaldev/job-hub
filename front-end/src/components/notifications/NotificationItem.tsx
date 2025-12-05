import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ExternalLink, Mail, User } from "lucide-react";

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

  return (
    <div
      className={`p-4 rounded-lg border ${
        notification.isRead
          ? "border-[#E3E3E3] bg-white"
          : "border-[#456882]/30 bg-[#E3E3E3]/50"
      }`}
    >
      <div className="flex justify-between">
        <div className="flex items-start gap-3">
          {!notification.isRead && (
            <div className="mt-1 w-2 h-2 rounded-full bg-[#234C6A] flex-shrink-0"></div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`font-medium ${
                  notification.isRead
                    ? "text-gray-700"
                    : "text-[#234C6A] font-semibold"
                }`}
              >
                {notification.title}
              </h3>
              {!notification.isRead && (
                <span className="inline-flex items-center rounded-full bg-[#234C6A] px-2 py-0.5 text-xs font-medium text-white">
                  Unread
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <User className="h-3 w-3" />
              <span>{notification.sender.name}</span>
              <span>•</span>
              <span>{formatDate(notification.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (notification.isRead) {
                onMarkAsUnread(notification._id);
              } else {
                onMarkAsRead(notification._id);
              }
            }}
            className={`${
              notification.isRead ? "text-[#456882]" : "text-[#234C6A]"
            } hover:text-[#234C6A]`}
          >
            {notification.isRead ? (
              <Mail className="h-4 w-4 text-green-500" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
          </Button>
          <Link href={notification.link}>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 border-[#234C6A] text-[#234C6A]"
            >
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
