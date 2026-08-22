import { formatShortDate } from '@/utils/formatters';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PendingReviewRow } from '@/types/trainingDept';

export const TRAINING_DEPT_PENDING_REVIEWS_COLUMNS = [
  {
    key: 'no',
    header: 'No.',
    render: (_row: PendingReviewRow, index?: number) => (
      <span className="text-textSidebarMuted">{(index ?? 0) + 1}.</span>
    ),
  },
  {
    key: 'employeeName',
    header: 'Employee',
    render: (row: PendingReviewRow) => (
      <span className="font-semibold text-white">{row.employeeName}</span>
    ),
  },
  {
    key: 'programTitle',
    header: 'Program Title',
    render: (row: PendingReviewRow) => row.programTitle,
  },
  {
    key: 'fromDate',
    header: 'From Date',
    render: (row: PendingReviewRow) => formatShortDate(row.fromDate),
  },
  {
    key: 'toDate',
    header: 'To Date',
    render: (row: PendingReviewRow) => formatShortDate(row.toDate),
  },
  {
    key: 'venue',
    header: 'Venue/City',
    render: (row: PendingReviewRow) => row.venue,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: PendingReviewRow) => <StatusBadge status={row.status} />,
  },
];
