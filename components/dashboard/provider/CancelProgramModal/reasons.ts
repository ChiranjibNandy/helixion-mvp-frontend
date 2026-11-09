import { ProgramCancellationReason } from '@/services/provider.service';

export type ReasonOption = { value: ProgramCancellationReason; label: string };

const BELOW_MINIMUM_REASON: ReasonOption = {
  value: 'insufficient_enrolments',
  label: 'Insufficient enrolments (below minimum)',
};

const OVER_CAPACITY_REASONS: ReasonOption[] = [
  { value: 'excess_enrolments', label: 'Excess enrolments (over-booked)' },
  { value: 'operational_constraints', label: 'Operational constraints' },
  { value: 'trainer_unavailable', label: 'Trainer unavailable' },
  { value: 'venue_unavailable', label: 'Venue unavailable' },
  { value: 'other', label: 'Other' },
];

export function getReasonOptions(belowMinimum: boolean): ReasonOption[] {
  return belowMinimum ? [BELOW_MINIMUM_REASON] : OVER_CAPACITY_REASONS;
}
