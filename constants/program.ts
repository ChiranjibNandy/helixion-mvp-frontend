export const STAY_TYPE_IDS = {
  RESIDENTIAL: 'residential',
  NON_RESIDENTIAL: 'non_residential',
} as const;

export enum PROGRAM_ENROLLMENT_STATUS {
  BELOW_MINIMUM = "BELOW_MINIMUM",
  ON_TRACK = "ON_TRACK",
  OVER_ENROLLED = "OVER_ENROLLED",
}

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
    FULL: 100
  },
  COLORS: {
    OVER_ENROLLED: "#2563eb",
    HIGH: "#16a34a",
    MEDIUM: "#f59e0b",
    LOW: "#ef4444",
  },
} as const;
