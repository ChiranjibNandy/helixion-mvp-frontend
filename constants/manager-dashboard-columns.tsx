import { formatShortDate } from '@/utils/formatters';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TeamEnrollmentRow } from '@/types/manager';

export const MANAGER_PENDING_ENROLLMENTS_COLUMNS = [
  {
    key: 'no',
    header: 'No.',
    render: (_row: TeamEnrollmentRow, index?: number) => (
      <span className="text-textSidebarMuted">{(index ?? 0) + 1}.</span>
    ),
  },
  {
    key: 'programTitle',
    header: 'Program Title',
    render: (row: TeamEnrollmentRow) => (
      <span className="font-semibold text-white">{row.programTitle}</span>
    ),
  },
  {
    key: 'fromDate',
    header: 'From Date',
    render: (row: TeamEnrollmentRow) => formatShortDate(row.fromDate),
  },
  {
    key: 'toDate',
    header: 'To Date',
    render: (row: TeamEnrollmentRow) => formatShortDate(row.toDate),
  },
  {
    key: 'venue',
    header: 'Venue/City',
    render: (row: TeamEnrollmentRow) => row.venue,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: TeamEnrollmentRow) => <StatusBadge status={row.status} />,
  },
];
