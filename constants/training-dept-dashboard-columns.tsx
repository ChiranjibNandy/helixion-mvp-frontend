import { formatShortDate } from '@/utils/formatters';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PendingReviewRow } from '@/types/trainingDept';
import { t } from '@/lib/i18n';

export const TRAINING_DEPT_PENDING_REVIEWS_COLUMNS = [
  {
    key: 'no',
    header: t('trainingDeptDashboard.columns.no'),
    render: (_row: PendingReviewRow, index?: number) => (
      <span className="text-textSidebarMuted">{(index ?? 0) + 1}.</span>
    ),
  },
  {
    key: 'employeeName',
    header: t('trainingDeptDashboard.columns.employee'),
    render: (row: PendingReviewRow) => (
      <span className="font-semibold text-white">{row.employeeName}</span>
    ),
  },
  {
    key: 'programTitle',
    header: t('trainingDeptDashboard.columns.programTitle'),
    render: (row: PendingReviewRow) => row.programTitle,
  },
  {
    key: 'fromDate',
    header: t('trainingDeptDashboard.columns.fromDate'),
    render: (row: PendingReviewRow) => formatShortDate(row.fromDate),
  },
  {
    key: 'toDate',
    header: t('trainingDeptDashboard.columns.toDate'),
    render: (row: PendingReviewRow) => formatShortDate(row.toDate),
  },
  {
    key: 'venue',
    header: t('trainingDeptDashboard.columns.venueCity'),
    render: (row: PendingReviewRow) => row.venue,
  },
  {
    key: 'status',
    header: t('trainingDeptDashboard.columns.status'),
    render: (row: PendingReviewRow) => <StatusBadge status={row.status} />,
  },
];
