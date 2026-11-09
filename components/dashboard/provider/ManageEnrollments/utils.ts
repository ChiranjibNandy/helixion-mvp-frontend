const TERMINAL_CANCELLED_STAGES = ['cancelled_by_provider', 'rejected'];
const CONFIRMED_STAGES = ['tour_pending_employee', 'tour_manager_review', 'tour_ctd_review', 'attended', 'absent', 'completed'];

export const CANCELLATION_REASON_LABEL: Record<string, string> = {
  insufficient_enrolments: 'Insufficient enrolments (below minimum)',
  excess_enrolments: 'Excess enrolments (over-booked)',
  operational_constraints: 'Operational constraints',
  trainer_unavailable: 'Trainer unavailable',
  venue_unavailable: 'Venue unavailable',
  other: 'Other',
};

export type DisplayStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export function displayStatus(stage: string): DisplayStatus {
  if (TERMINAL_CANCELLED_STAGES.includes(stage)) return 'Cancelled';
  if (CONFIRMED_STAGES.includes(stage)) return 'Confirmed';
  return 'Pending';
}

export function statusBadgeClass(status: DisplayStatus): string {
  switch (status) {
    case 'Confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-amber-100 text-amber-700 border-amber-200';
  }
}

export function formatDate(iso?: string): string {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
}

export function countActiveEnrollments(enrollments: { currentStage: string }[]): number {
  return enrollments.filter((e) => displayStatus(e.currentStage) !== 'Cancelled').length;
}
