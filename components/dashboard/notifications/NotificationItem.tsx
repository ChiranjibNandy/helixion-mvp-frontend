import { EmployeeNotification } from "@/services/notificationService";
import { formatTime } from "@/utils/formatters";
import { NOTIFICATION_DOT_COLORS } from "@/constants/notifications";

interface NotificationItemProps {
  notification: EmployeeNotification;
  unread: boolean;
}

export function NotificationItem({ notification, unread }: NotificationItemProps) {
  const dotColor = NOTIFICATION_DOT_COLORS[notification.type] ?? "bg-textSecondary";

  return (
    <div className={`flex items-start gap-3 py-3 px-2 rounded-md ${unread ? "bg-white/[0.04]" : ""}`}>
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <div className="text-textSecondary text-sm leading-relaxed">{notification.message}</div>
        <div className="text-textSidebarMuted text-xs mt-1">{formatTime(notification.at)}</div>
      </div>
      {unread && (
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}
