export const STAY_TYPE_IDS = {
  RESIDENTIAL: 'residential',
  NON_RESIDENTIAL: 'non_residential',
} as const;

export enum PROGRAM_ENROLLMENT_STATUS {
  BELOW_MINIMUM = "BELOW_MINIMUM",
  CRITICAL = "CRITICAL",
  ON_TRACK = "ON_TRACK",
  OVER_ENROLLED = "OVER_ENROLLED",
}

export const PROGRAM_STATUS_CONFIG = {
  [PROGRAM_ENROLLMENT_STATUS.BELOW_MINIMUM]: {
    label: "Below Minimum",
    subtitle: "More enrollments required",
    className: "bg-amber-500/10 text-amber-400",
    color: "#f59e0b",
  },

  [PROGRAM_ENROLLMENT_STATUS.CRITICAL]: {
    label: "Critical",
    subtitle: "Program may need cancellation",
    className: "bg-red-500/10 text-red-400",
    color: "#ef4444",
  },

  [PROGRAM_ENROLLMENT_STATUS.ON_TRACK]: {
    label: "On Track",
    subtitle: "Minimum enrollment achieved",
    className: "bg-emerald-500/10 text-emerald-400",
    color: "#16a34a",
  },

  [PROGRAM_ENROLLMENT_STATUS.OVER_ENROLLED]: {
    label: "Over Enrolled",
    subtitle: "Excess enrollment requires attention",
    className: "bg-blue-500/10 text-blue-400",
    color: "#2563eb",
  },
} as const satisfies Record<
  PROGRAM_ENROLLMENT_STATUS,
  {
    label: string;
    subtitle: string;
    className: string;
    color: string;
  }
>;

export const UPCOMING_PROGRAMS_DAYS_THRESHOLD = {
  URGENT: 7,
  WARNING: 14,
} as const;

export const ENROLMENT_DONUT_CONFIG = {
  RADIUS: 24,
  SIZE: 68,
  CENTER: 34,
  STROKE_WIDTH: 6,
  THRESHOLDS: {
    HIGH: 75,
    MEDIUM: 50,
    FULL: 100,
  },

  COLORS: {
    OVER_ENROLLED: "#2563eb",
    HIGH: "#16a34a",
    MEDIUM: "#f59e0b",
    LOW: "#ef4444",
  },
} as const;
