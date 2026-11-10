import { UPCOMING_PROGRAMS_DAYS_THRESHOLD } from "@/constants/program";
import { t } from "@/lib/i18n";

interface DaysToGoBadgeProps {
  daysToGo: number;
}

export function DaysToGoBadge({
  daysToGo,
}: DaysToGoBadgeProps) {
  const config =
    daysToGo <= UPCOMING_PROGRAMS_DAYS_THRESHOLD.URGENT
      ? "bg-red-500/10 text-red-400"
      : daysToGo <= UPCOMING_PROGRAMS_DAYS_THRESHOLD.WARNING
        ? "bg-amber-500/10 text-amber-400"
        : "bg-emerald-500/10 text-emerald-400";

  return (
    <div className={`flex flex-col items-center justify-center rounded-lg px-3 py-2 min-w-[70px] ${config}`}>
      <span className="text-lg font-bold">
        {daysToGo}
      </span>

      <span className="text-xs font-medium">
        {t("upcomingPrograms.days.day")}
      </span>
    </div>
  );
}