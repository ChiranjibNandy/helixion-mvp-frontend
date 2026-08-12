'use client';

import { useRegistrations } from '@/hooks/useRegistrations';
import { useAdminDashboardStats } from '@/hooks/useAdminDashboardStats';
import { ADMIN_CONTENT } from '@/constants/content';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { DashboardStats } from '@/components/shared/dashboard-stats';
import { PendingRegistrationsSection } from '@/components/admin-dashboard/pending-registrations-section';



export default function AdminDashboard() {
  const {
    registrations,
    loading,
    error,
    refetch,
  } = useRegistrations();

  const { stats: dashboardStats, loading: statsLoading } = useAdminDashboardStats();

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
        </div>

        <RecentActivity activities={[]} />
      </div>
    </div>
  );
}