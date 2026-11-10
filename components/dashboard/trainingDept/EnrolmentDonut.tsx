import { ENROLMENT_DONUT_CONFIG } from "@/constants/program";

interface EnrolmentDonutProps {
  enrolledCount: number;
  maxParticipants?: number;
  fillRate: number;
}

export function EnrolmentDonut({
  enrolledCount,
  maxParticipants,
  fillRate,
}: EnrolmentDonutProps) {
  const {
    RADIUS,
    SIZE,
    CENTER,
    STROKE_WIDTH,
    THRESHOLDS,
    COLORS,
  } = ENROLMENT_DONUT_CONFIG;

  const circumference = 2 * Math.PI * RADIUS;

  // Clamp visual progress to 100%
  const progress = Math.min(Math.max(fillRate, 0), 100);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  const color =
    fillRate > ENROLMENT_DONUT_CONFIG.THRESHOLDS.FULL
      ? COLORS.OVER_ENROLLED
      : fillRate >= THRESHOLDS.HIGH
        ? COLORS.HIGH
        : fillRate >= THRESHOLDS.MEDIUM
          ? COLORS.MEDIUM
          : COLORS.LOW;

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