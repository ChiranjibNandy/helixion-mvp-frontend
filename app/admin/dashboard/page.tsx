'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useAdminDashboardStats } from '@/hooks/useAdminDashboardStats';
import { ADMIN_CONTENT } from '@/constants/content';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { DashboardStats } from '@/components/shared/dashboard-stats';
import { PendingRegistrationsSection } from '@/components/admin-dashboard/pending-registrations-section';
import PaginationController from '@/components/ui/pagination';



export default function AdminDashboard() {
  const {
    registrations,
    loading,
    error,
    refetch,
    pagination,
    setPage,
  } = useRegistrations();

  const { stats: dashboardStats, loading: statsLoading, error: statsError } = useAdminDashboardStats();

  useEffect(() => {
    if (statsError) toast.error(statsError);
  }, [statsError]);

  const { STATS } = ADMIN_CONTENT.DASHBOARD;

  // Show a dash while stats load; "Active today" was removed — there's no
  // last-login field to compute it from.
  const dash = (v: number | undefined) => (statsLoading || v === undefined ? '-' : v);

  const stats = [
    {
      title: STATS.TOTAL_USERS,
      value: dash(dashboardStats?.totalUsers),
    },
    {
      title: STATS.ACTIVE_USERS,
      value: dash(dashboardStats?.activeUsers),
    },
    {
      title: STATS.PENDING_APPROVAL,
      value: dash(dashboardStats?.pendingApproval),
    },
    {
      title: STATS.DEACTIVATED,
      value: dash(dashboardStats?.deactivated),
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-3 gap-6 my-4">
        <div className="col-span-2">
          <PendingRegistrationsSection
            registrations={registrations}
            loading={loading}
            error={error}
            refetch={refetch}
          />

          {pagination && pagination.totalPages >= 1 && (
            <PaginationController
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>

        <RecentActivity activities={[]} />
      </div>
    </div>
  );
}