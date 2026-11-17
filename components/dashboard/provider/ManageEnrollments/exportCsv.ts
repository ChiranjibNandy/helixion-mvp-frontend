import { ManagedEnrollment } from '@/services/provider.service';
import { displayStatus, formatDate } from './utils';

export function exportEnrollmentsToCsv(programTitle: string, enrollments: ManagedEnrollment[]) {
  const header = ['Employee Name', 'Company Name', 'Nomination Date', 'Status'];
  const rows = enrollments.map((e) => [
    e.employeeId?.name ?? '',
    e.orgId?.name ?? '',
    formatDate(e.createdAt),
    displayStatus(e.currentStage),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${programTitle}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
