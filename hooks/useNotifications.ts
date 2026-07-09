"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getEmployeeNotifications, EmployeeNotification } from "@/services/notificationService";
import { t } from "@/lib/i18n";

const LAST_SEEN_KEY = "helixon:notifications:lastSeenAt";
const POLL_INTERVAL_MS = 45_000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);
  const [lastSeenAt, setLastSeenAt] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(LAST_SEEN_KEY);
    setLastSeenAt(stored ? Number(stored) : 0);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getEmployeeNotifications();
      if (!isMountedRef.current) return;
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load notifications", err);
      if (isMountedRef.current) setError(t('notifications.fetchError'));
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(
    (n) => new Date(n.at).getTime() > lastSeenAt
  ).length;

  const markAllSeen = useCallback(() => {
    const now = Date.now();
    setLastSeenAt(now);
    localStorage.setItem(LAST_SEEN_KEY, String(now));
  }, []);

  return { notifications, unreadCount, lastSeenAt, markAllSeen, error };
}
