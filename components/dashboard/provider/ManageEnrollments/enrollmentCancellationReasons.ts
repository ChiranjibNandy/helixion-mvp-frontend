import { EnrollmentCancellationReason } from '@/services/provider.service';

export const ENROLLMENT_CANCELLATION_REASONS: { value: EnrollmentCancellationReason; label: string }[] = [
  { value: 'employee_unavailable', label: 'Employee unavailable' },
  { value: 'duplicate_nomination', label: 'Duplicate nomination' },
  { value: 'budget_constraints', label: 'Budget constraints' },
  { value: 'role_change', label: 'Role change' },
  { value: 'other', label: 'Other' },
];
