"use client";

import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationList } from "./NotificationList";
import { useNotifications } from "@/hooks/useNotifications";
import { t } from "@/lib/i18n";

export function NotificationBell() {
  const { notifications, unreadCount, lastSeenAt, markAllSeen, error } = useNotifications();

  return (
    <Popover onOpenChange={(open) => open && markAllSeen()}>
      <PopoverTrigger  aria-label={t("notifications.ariaLabel")} className="relative text-textSecondary hover:text-white p-2 rounded-md transition-colors">
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"
            aria-hidden="true"
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="p-3">
        <div className="px-2 pb-2">
          <h3 className="text-white text-sm font-semibold">{t('notifications.title')}</h3>
        </div>
        <NotificationList
          notifications={notifications}
          lastSeenAt={lastSeenAt}
          error={error}
        />
      </PopoverContent>
    </Popover>
  );
}