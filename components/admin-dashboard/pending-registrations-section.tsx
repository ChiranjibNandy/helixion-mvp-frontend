'use client';

import { Registration } from '@/types/auth';

import { UI_MESSAGES } from '@/constants/admin';
import { ADMIN_CONTENT } from '@/constants/content';
import { DashboardSectionCard } from '@/components/shared/dashboard-section-card';
import { DataTable } from '@/components/shared/data-table';
import { AppAlert } from '@/components/shared/app-alert';
import { getRegistrationColumns } from '@/constants/registration-columns';

interface Props {
  registrations: Registration[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function PendingRegistrationsSection({
  registrations,
  loading,
  error,
  refetch,
}: Props) {
  const { SECTIONS } = ADMIN_CONTENT.DASHBOARD;

  const columns = getRegistrationColumns(refetch);

  if (loading) {
    return (
      <div className="p-6 text-center">
        {UI_MESSAGES.LOADING_REGISTRATIONS}
      </div>
    );
  }

  if (error) {
    return (
      <AppAlert
        variant="destructive"
        description={error}
      />
    );
  }

  return (
    <DashboardSectionCard
      title={SECTIONS.PENDING_REGISTRATIONS}
    >
      <DataTable<Registration>
        data={registrations}
        columns={columns}
        emptyMessage="No pending registrations"
      />
    </DashboardSectionCard>
  );
}