'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminDashboardStatsAPI } from '@/services/adminService';
import { Activity } from '@/types/admin';
import { formatUpdatedAt } from '@/utils/formatters';

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingApproval: number;
  deactivated: number;
  recentActivity: Activity[];
}

export function useAdminDashboardStats() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDashboardStatsAPI();
      const body = res.data;
      setStats({
        totalUsers: body.totalUsers ?? 0,
        activeUsers: body.activeUsers ?? 0,
        pendingApproval: body.pendingApproval ?? 0,
        deactivated: body.deactivated ?? 0,
        recentActivity: (body.recentActivity ?? []).map((a: Activity) => ({
          ...a,
          time: formatUpdatedAt(a.time),
        })),
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, error, refresh: fetch };
}
