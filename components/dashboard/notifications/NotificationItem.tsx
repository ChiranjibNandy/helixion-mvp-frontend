"use client";

import { Check } from "lucide-react";
import { EmployeeNotification, readNotification } from "@/services/notificationService";
import { formatTime } from "@/utils/formatters";
import { NOTIFICATION_DOT_COLORS } from "@/constants/notifications";

interface NotificationItemProps {
  notification: EmployeeNotification;
  read: boolean;
}

export function NotificationItem({ notification, read }: NotificationItemProps) {
  const dotColor = NOTIFICATION_DOT_COLORS[notification.type] ?? "bg-textSecondary";

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await readNotification(notification._id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <div
      className={`group flex items-start gap-3 py-3 px-2 rounded-md transition-colors ${
        read ? "bg-white/[0.04]" : ""
      }`}
    >
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`} aria-hidden="true" />
      
      <div className="flex-1 min-w-0">
        <div className="text-textSecondary text-sm leading-relaxed">{notification.message}</div>
        <div className="text-textSidebarMuted text-xs mt-1">{formatTime(notification.at)}</div>
      </div>

      {!read && (
        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <button
            onClick={handleMarkAsRead}
            title="Mark as read"
            aria-label="Mark notification as read"
            className="p-1 text-textSidebarMuted hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}