// Mirrors the notification `type` strings produced by the backend's
// NOTIFICATION_RULES table (helixion-mvp-backend/src/services/employee.service.ts).
// These live in two separate repos, so this can't be a shared import — if the
// backend adds or renames an event type, this map (and its dot color) needs a
// matching update.
export const NOTIFICATION_TYPE = {
  ENROLLMENT_REJECTED:      'enrollment_rejected',
  ENROLLMENT_APPROVED:      'enrollment_approved',
  ATTENDANCE_PRESENT:       'attendance_present',
  ATTENDANCE_ABSENT:        'attendance_absent',
  REIMBURSEMENT_APPROVED:   'reimbursement_approved',
  REIMBURSEMENT_REJECTED:   'reimbursement_rejected',
  SELF_TRAVEL_SELECTED:     'self_travel_selected',
  TRAVEL_REQUEST_SUBMITTED: 'travel_request_submitted',
  TRAVEL_UNDER_CTD_REVIEW:  'travel_under_ctd_review',
  TRAVEL_REJECTED_BY_MANAGER: 'travel_rejected_by_manager',
  TRAVEL_APPROVED:          'travel_approved',
  TRAVEL_REJECTED_BY_CTD:   'travel_rejected_by_ctd',
  TRAVEL_TIMED_OUT:         'travel_timed_out',
} as const;

export const NOTIFICATION_DOT_COLORS: Record<string, string> = {
  [NOTIFICATION_TYPE.ENROLLMENT_REJECTED]:      'bg-accentRed',
  [NOTIFICATION_TYPE.ENROLLMENT_APPROVED]:      'bg-accentGreen',
  [NOTIFICATION_TYPE.ATTENDANCE_PRESENT]:       'bg-primary',
  [NOTIFICATION_TYPE.ATTENDANCE_ABSENT]:        'bg-accentOrange',
  [NOTIFICATION_TYPE.REIMBURSEMENT_APPROVED]:   'bg-accentGreen',
  [NOTIFICATION_TYPE.REIMBURSEMENT_REJECTED]:   'bg-accentRed',
  [NOTIFICATION_TYPE.SELF_TRAVEL_SELECTED]:     'bg-primary',
  [NOTIFICATION_TYPE.TRAVEL_REQUEST_SUBMITTED]: 'bg-primary',
  [NOTIFICATION_TYPE.TRAVEL_UNDER_CTD_REVIEW]:  'bg-primary',
  [NOTIFICATION_TYPE.TRAVEL_REJECTED_BY_MANAGER]: 'bg-accentRed',
  [NOTIFICATION_TYPE.TRAVEL_APPROVED]:          'bg-accentGreen',
  [NOTIFICATION_TYPE.TRAVEL_REJECTED_BY_CTD]:   'bg-accentOrange',
  [NOTIFICATION_TYPE.TRAVEL_TIMED_OUT]:         'bg-accentOrange',
};
