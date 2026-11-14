
import { ENROLMENT_DONUT_CONFIG, PROGRAM_ENROLLMENT_STATUS } from "@/constants/program";

interface EnrolmentDonutProps {
  enrolledCount: number;
  maxParticipants?: number;
  fillRate: number;
  status: PROGRAM_ENROLLMENT_STATUS;
}

const DONUT_STATUS_COLORS = {
  [PROGRAM_ENROLLMENT_STATUS.BELOW_MINIMUM]: "#f59e0b",
  [PROGRAM_ENROLLMENT_STATUS.CRITICAL]: "#ef4444",
  [PROGRAM_ENROLLMENT_STATUS.ON_TRACK]: "#16a34a",
  [PROGRAM_ENROLLMENT_STATUS.OVER_ENROLLED]: "#2563eb",
};

export function EnrolmentDonut({
  enrolledCount,
  maxParticipants,
  fillRate,
  status,
}: EnrolmentDonutProps) {
  const {
    RADIUS,
    SIZE,
    CENTER,
    STROKE_WIDTH,
  } = ENROLMENT_DONUT_CONFIG;

  const circumference = 2 * Math.PI * RADIUS;

  // Clamp visual progress to 100%
  const progress = Math.min(Math.max(fillRate, 0), 100);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  // Use backend program status to determine donut color
  const color = DONUT_STATUS_COLORS[status];

  return (
    <div className="relative flex items-center justify-center w-[68px] h-[68px]">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          className="text-borderCard"
        />

        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white">
          {enrolledCount}
        </span>

        <span className="text-[10px] text-textSidebarMuted">
          / {maxParticipants ?? "-"}
        </span>
      </div>
    </div>
  );
}
