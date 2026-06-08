import { Progress } from '@/components/ui/progress';
import { formatShortDate } from '@/utils/formatters';
import { DashboardTopProgram } from '@/services/provider.service';

export const PROVIDER_PROGRAM_COLUMNS = [
  {
    key: 'program',
    header: 'Program',
    render: (row: DashboardTopProgram) => (
      <span className="text-textSecondary text-sm font-normal pl-6">
        {row.title}
      </span>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    render: (row: DashboardTopProgram) => (
      <span className="text-textSidebarMuted text-xs">
        {formatShortDate(row.startDate)}
      </span>
    ),
  },
  {
    key: 'enrolled',
    header: 'Enrolled',
    render: (row: DashboardTopProgram) => (
      <span className="text-textSecondary text-sm text-center">
        {row.enrolledCount} / {row.maxParticipants}
      </span>
    ),
  },
  {
    key: 'fill',
    header: 'Fill',
    render: (row: DashboardTopProgram) => (
      <div className="flex justify-end">
        <Progress
          value={row.fillRate}
          className="h-1.5 w-16 bg-[#1e293b]"
        />
      </div>
    ),
  },
];