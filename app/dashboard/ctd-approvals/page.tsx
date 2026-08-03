'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ApprovalStatusBadge from '@/components/shared/ApprovalStatusBadge';
import DataTable from '@/components/shared/data-table';
import ConfirmApprovalModal from '@/components/dashboard/approvals/ConfirmApprovalModal';
import { AppAlert } from '@/components/shared/app-alert';
import { useCtdApprovals } from '@/hooks/useCtdApprovals';
import { formatDate } from '@/utils/formatters';
import { EnrollmentApproval } from '@/types/enrollment';
import {
  takeCtdJuniorActionAPI,
  takeCtdSeniorActionAPI,
} from '@/services/enrollmentApprovalService';

// Reads the client-readable access token cookie directly — this page has no
// other way to know the current user's permissions (DashboardShell doesn't
// expose them via context). A level-1 junior officer can review but is not
// authorized to call the senior-action endpoint at all; attempting it
// anyway would 403 even though their own (junior) action already succeeded.
function canApproveTrainingDept(): boolean {
  if (typeof document === 'undefined') return false;
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken_client='))
    ?.split('=')[1];
  if (!token) return false;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return !!JSON.parse(json)?.permissions?.canApproveTrainingDept;
  } catch {
    return false;
  }
}

export default function CtdApprovalsPage() {
  const { data, loading, error, refresh } = useCtdApprovals();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionRow, setActionRow] = useState<EnrollmentApproval | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const closeModal = () => {
    if (actionLoading) return;
    setActionRow(null);
    setActionError(null);
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!actionRow) return;

    setActionLoading(true);
    setActionError(null);

    try {
      // Junior review must be recorded before the senior approve/reject
      // action is accepted. A 409 here just means someone already reviewed
      // it — safe to ignore and proceed to the senior action.
      try {
        await takeCtdJuniorActionAPI(actionRow._id);
      } catch (err: any) {
        if (err?.response?.status !== 409) throw err;
      }

      // Only a senior officer may call the senior-action endpoint at all —
      // a junior-only user's review above already succeeded on its own and
      // should be treated as complete, not chased with a call that will 403.
      if (canApproveTrainingDept()) {
        await takeCtdSeniorActionAPI(actionRow._id, action);
      }

      setActionRow(null);
      refresh();
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message || err?.message || 'Something went wrong'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Employee Name',
      render: (row: EnrollmentApproval) => (
        <div className="font-medium">{row.employeeId?.name || 'Unknown'}</div>
      ),
    },
    {
      header: 'Program Title',
      render: (row: EnrollmentApproval) => row.programId?.title || '-',
    },
    {
      header: 'From Date',
      render: (row: EnrollmentApproval) => formatDate(row.programId?.startDate),
    },
    {
      header: 'To Date',
      render: (row: EnrollmentApproval) => formatDate(row.programId?.endDate),
    },
    {
      header: 'Venue / City',
      render: (row: EnrollmentApproval) =>
        row.programId?.venueName || row.programId?.city || '-',
    },
    {
      header: 'Status',
      render: () => <ApprovalStatusBadge status="pending" />,
    },
    {
      header: '',
      className: 'w-10',
      render: (row: EnrollmentApproval) =>
        expanded === row._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CTD Approvals</h1>
        <p className="text-gray-400 text-sm">
          Review and approve training enrolments awaiting Training Dept approval.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <AppAlert variant="destructive" title="Error" description={error} />
        </div>
      )}

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        rowKey={(row: EnrollmentApproval) => row._id}
        onRowClick={(row: EnrollmentApproval) =>
          setExpanded(expanded === row._id ? null : row._id)
        }
        isRowExpanded={(row: EnrollmentApproval) => expanded === row._id}
        renderExpandedRow={(row: EnrollmentApproval) => (
          <div className="p-6 bg-white/5 border-b border-borderCard">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70 mb-4">
              <div>
                <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                  Employee Email
                </span>
                {row.employeeId?.email || '-'}
              </div>
              <div>
                <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                  Department
                </span>
                {row.employeeId?.department || '-'}
              </div>
              <div>
                <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                  Manager Approval
                </span>
                {row.managerApproval?.action || '-'}
              </div>
              <div>
                <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                  Notes
                </span>
                {row.notes || '-'}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-borderCard">
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionRow(row);
                }}
              >
                Take Action
              </button>
            </div>
          </div>
        )}
      />

      <ConfirmApprovalModal
        isOpen={Boolean(actionRow)}
        row={actionRow}
        loading={actionLoading}
        error={actionError}
        onApprove={() => handleAction('approve')}
        onReject={() => handleAction('reject')}
        onCancel={closeModal}
      />
    </div>
  );
}
