
import { PROGRAM_ENROLLMENT_STATUS } from "@/constants/program";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { t } from "@/lib/i18n";

interface UpcomingProgramStatusBadgeProps {
  status: PROGRAM_ENROLLMENT_STATUS;
}

const statusConfig = {
  [PROGRAM_ENROLLMENT_STATUS.BELOW_MINIMUM]: {
    label: "belowMinimum",
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-500",
  },

  [PROGRAM_ENROLLMENT_STATUS.ON_TRACK]: {
    label: "onTrack",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-500",
  },

  [PROGRAM_ENROLLMENT_STATUS.OVER_ENROLLED]: {
    label: "overEnrolled",
    icon: Info,
    className: "bg-blue-500/10 text-blue-500",
  },
} as const;

export function UpcomingProgramStatusBadge({
  status,
}: UpcomingProgramStatusBadgeProps) {
  const config = statusConfig[status];

  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 min-w-[190px] ${ config.className }`}
    >
      <Icon className="size-6 shrink-0" />

      <div className="flex flex-col">
        <span className="text-sm font-semibold whitespace-nowrap">
          {t(`upcomingPrograms.status.${ config.label }.label`)}
        </span>

        <span className="text-xs opacity-80 whitespace-nowrap">
          {t(`upcomingPrograms.status.${ config.label }.subtitle`)}
        </span>
      </div>
    </div>
  );
}
