import { useState, useEffect, useCallback } from "react";
import {
  EmployeeNotification,
  getNotifications,
} from "@/services/notificationService";

export function useNotifications() {
  const [notifications, setNotifications] = useState<EmployeeNotification[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [lastSeenAt, setLastSeenAt] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedLastSeenAt = Number(
      localStorage.getItem("notifications_last_seen_at") || 0
    );

    setLastSeenAt(storedLastSeenAt);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);

      const res = await getNotifications();

      const list: EmployeeNotification[] = res.notifications || [];

      setNotifications(list);
      setUnreadCount(res.unreadCount);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }, []);

  const markAllSeen = useCallback(() => {
    const now = Date.now();

    setLastSeenAt(now);
    setUnreadCount(0);

    localStorage.setItem(
      "notifications_last_seen_at",
      String(now)
    );
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    lastSeenAt,
    markAllSeen,
    error,
  };
}