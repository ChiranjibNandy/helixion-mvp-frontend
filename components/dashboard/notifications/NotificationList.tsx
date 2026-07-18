import { EmployeeNotification } from "@/services/notificationService";
import { NotificationItem } from "./NotificationItem";
import { t } from "@/lib/i18n";

interface NotificationListProps {
  notifications: EmployeeNotification[];
  lastSeenAt: number;
  error?: string | null;
}

export function NotificationList({ notifications, lastSeenAt, error }: NotificationListProps) {
  if (error && notifications.length === 0) {
    return (
      <div className="py-8 text-center text-accentRed text-sm">
        {error}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center text-textSidebarMuted text-sm">
        {t('notifications.empty')}
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto -mx-1">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          unread={new Date(notification.at).getTime() > lastSeenAt}
        />
      ))}
    </div>
  );
}
