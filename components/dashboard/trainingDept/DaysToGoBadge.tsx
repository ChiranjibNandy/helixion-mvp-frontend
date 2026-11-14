import { PROGRAM_ENROLLMENT_STATUS, UPCOMING_PROGRAMS_DAYS_THRESHOLD } from "@/constants/program";
import { t } from "@/lib/i18n";

interface DaysToGoBadgeProps {
  daysToGo: number;
  status: PROGRAM_ENROLLMENT_STATUS;
}

const statusColorConfig = {
  [PROGRAM_ENROLLMENT_STATUS.BELOW_MINIMUM]:
    "bg-amber-500/10 text-amber-400",

  [PROGRAM_ENROLLMENT_STATUS.CRITICAL]:
    "bg-red-500/10 text-red-400",

  [PROGRAM_ENROLLMENT_STATUS.ON_TRACK]:
    "bg-emerald-500/10 text-emerald-400",

  [PROGRAM_ENROLLMENT_STATUS.OVER_ENROLLED]:
    "bg-blue-500/10 text-blue-400",
};

export function DaysToGoBadge({
  daysToGo,
  status
}: DaysToGoBadgeProps) {
  const config = statusColorConfig[status];
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg px-3 py-2 min-w-[70px] ${ config }`}>
      <span className="text-lg font-bold">
        {daysToGo}
      </span>

      <span className="text-xs font-medium">
        {t("upcomingPrograms.days.day")}
      </span>
    </div>
  );
}