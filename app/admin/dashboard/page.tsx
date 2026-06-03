'use client';

import { useRegistrations } from '@/hooks/useRegistrations';
import { COLOR_CLASSES, UI_MESSAGES } from '@/constants/admin';
import { ADMIN_CONTENT } from '@/constants/content';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { DashboardStats } from '@/components/shared/dashboard-stats';
import { DashboardSectionCard } from '@/components/shared/dashboard-section-card';
import { DataTable } from '@/components/shared/data-table';
import { CheckCircle2, XCircle } from 'lucide-react';
import { getInitials } from '@/utils/nameInitial';
import { Registration } from '@/types/auth';
import { useApproveUser } from '@/hooks/useApproveUser';
import AppModal from '@/components/ui/app-modal';
import { AppAlert } from '@/components/shared/app-alert';
import { Role } from '@/types/role';
import { ROLES } from '@/constants/role';
import { t } from '@/lib/i18n';

function ApproveModalContent({
  name,
  email,
  role,
  onRoleChange,
}: {
  name: string;
  email: string;
  role: Role | '';
  onRoleChange: (r: Role) => void;
}) {
  return (
    <div className="flex flex-col">

      <div className="rounded-xl bg-white/5 border border-white/8 px-4 py-3">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-white/40 mt-0.5">{email}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white">
          {t('admin.approveUser.assignRole')}
        </label>

        <select
          aria-label='role'
          value={role}
          onChange={(e) => onRoleChange(e.target.value as Role)}
          className="w-full rounded-xl bg-transparent border border-blue-500/60 text-white text-sm px-4 py-2.5 outline-none cursor-pointer appearance-none"
        >
          <option value="" disabled hidden>
            {t('admin.approveUser.selectRole')}
          </option>

          {ROLES.map((r) => (
            <option key={r} value={r} className="bg-[#1a1b25] text-white">
              {r}
            </option>
          ))}
        </select>

        <p className="text-xs text-white/40">
          {t('admin.approveUser.roleHelp')}
        </p>
      </div>
    </div>
  );
}


function ActionsCell({
  user,
  refetch,
}: {
  user: Registration;
  refetch: () => void;
}) {
  const {
    isOpen,
    successOpen,
    role,
    loading,
    error,
    setRole,
    openModal,
    closeModal,
    approveUser,
    closeSuccess,
  } = useApproveUser({
    userId: user.id, // or user._id if backend uses MongoDB
    onSuccess: refetch,
  });

  return (
    <>
      <div className="flex justify-end gap-3">
        <CheckCircle2
          size={18}
          className="text-green-400 cursor-pointer"
          onClick={openModal}
        />
        <XCircle size={18} className="text-red-400 cursor-pointer" />
      </div>

      {/* CONFIRM MODAL */}
      <AppModal
        isOpen={isOpen}
        type="confirm"
        title={t('admin.approveUser.title')}
        description={
          <>
            <ApproveModalContent
              name={user.name}
              email={user.email}
              role={role}
              onRoleChange={setRole}
            />

            {error && (
              <div className="mt-3">
                <AppAlert variant="destructive" description={error} />
              </div>
            )}
          </>
        }
        confirmLabel={t('button.confirm')}
        cancelLabel={t('button.cancel')}
        loading={loading}
        onConfirm={approveUser}
        onCancel={closeModal}
      />

      {/* SUCCESS MODAL */}
      <AppModal
        isOpen={successOpen}
        type="success"
        title={t('admin.approveUser.successTitle')}
        description={t('admin.approveUser.successDescription')}
        doneLabel={t('button.done')}
        stats={[
          {
            label: t('admin.approveUser.roleAssigned'),
            variant: 'green',
          },
          {
            label: role,
            variant: 'blue',
          },
        ]}
        onDone={closeSuccess}
      />
    </>
  );
}

export default function AdminDashboard() {
  const { registrations, loading, error, refetch } = useRegistrations();

  const { STATS, SECTIONS } = ADMIN_CONTENT.DASHBOARD;

  const stats = [
    {
      title: STATS.TOTAL_USERS,
      value: "-",
    },
    {
      title: STATS.PENDING_APPROVAL,
      value: registrations.length,
    },
    {
      title: STATS.ACTIVE_TODAY,
      value: "-",
    },
    {
      title: STATS.DEACTIVATED,
      value: "-",
    },
  ];

  const COLUMN = [
    {
      key: "user",
      header: "User",
      render: (row: Registration) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-slate-700 flex items-center justify-center text-xs font-bold">
            {getInitials(row.name)}
          </div>
          <div>
            <p className="text-white text-sm">{row.name}</p>
            <p className="text-textSidebarMuted text-xs">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (row: Registration) => (
        <span className="text-textSidebarMuted text-xs">
          {row.date}
        </span>
      ),
    },
    {
      key: "action",
      header: "Actions",
      render: (row: Registration) => (
        <ActionsCell user={row} refetch={refetch} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex-1 flex flex-col overflow-hidden gap-y-4">
        <div className="flex-1 overflow-y-auto">

          <DashboardStats stats={stats} />

          <div className="grid grid-cols-3 gap-6 my-4">
            <div className="col-span-2">

              {loading ? (
                <div className="p-6 text-center">
                  {UI_MESSAGES.LOADING_REGISTRATIONS}
                </div>
              ) : error ? (
                <AppAlert variant="destructive" description={error} />
              ) : (
         
                  <DashboardSectionCard
                    title={SECTIONS.PENDING_REGISTRATIONS}
                  >
                    <DataTable<Registration>
                      data={registrations}
                      columns={COLUMN}
                      emptyMessage="No pending registrations"
                    />
                  </DashboardSectionCard>

        
              )}
            </div>
              <RecentActivity activities={[]} />
          </div>

        </div>
      </div>
    </div>
  );
}