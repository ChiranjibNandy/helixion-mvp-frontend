'use client';

import { useRegistrations } from '@/hooks/useRegistrations';
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

  const { STATS } = ADMIN_CONTENT.DASHBOARD;

  const stats = [
    {
      title: STATS.TOTAL_USERS,
      value: '-',
    },
    {
      title: STATS.PENDING_APPROVAL,
      value: registrations.length,
    },
    {
      title: STATS.ACTIVE_TODAY,
      value: '-',
    },
    {
      title: STATS.DEACTIVATED,
      value: '-',
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