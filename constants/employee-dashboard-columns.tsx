import { t } from '@/lib/i18n';
import { formatDateRange } from '@/utils/formatters';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ListedProgram } from '@/types/employee';

export const EMPLOYEE_PROGRAM_COLUMNS = [
  {
    key: 'title',
    header: t('table.programTitle'),
    render: (program: ListedProgram) => program.title,
  },
  {
    key: 'dates',
    header: t('table.dates'),
    render: (program: ListedProgram) =>
      formatDateRange(program.startDate, program.endDate),
  },
  {
    key: 'venue',
    header: t('table.venue'),
    render: (program: ListedProgram) => program.venueName,
  },
  {
    key: 'status',
    header: t('table.status'),
    render: (program: ListedProgram) => (
      <StatusBadge status={program.status} />
    ),
  },
];