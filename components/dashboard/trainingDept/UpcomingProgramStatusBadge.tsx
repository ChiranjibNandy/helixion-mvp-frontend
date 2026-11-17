import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Users,
} from "lucide-react";

import { PROGRAM_ENROLLMENT_STATUS } from "@/constants/program";

interface UpcomingProgramStatusBadgeProps {
  status: PROGRAM_ENROLLMENT_STATUS;
}

const statusConfig = {
  [PROGRAM_ENROLLMENT_STATUS.BELOW_MINIMUM]: {
    label: "Below Minimum",
    subtitle: "More enrollments required",
    icon: Info,
    className: "bg-amber-500/10 text-amber-400",
  },

  [PROGRAM_ENROLLMENT_STATUS.CRITICAL]: {
    label: "Critical",
    subtitle: "Program may need cancellation",
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-400",
  },

  [PROGRAM_ENROLLMENT_STATUS.ON_TRACK]: {
    label: "On Track",
    subtitle: "Minimum enrollment achieved",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-400",
  },

  [PROGRAM_ENROLLMENT_STATUS.OVER_ENROLLED]: {
    label: "Over Enrolled",
    subtitle: "Excess enrollment requires attention",
    icon: Users,
    className: "bg-blue-500/10 text-blue-400",
  },
};

export function UpcomingProgramStatusBadge({
  status,
}: UpcomingProgramStatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${ config.className }`}
    >
      <Icon size={16} />

      <div>
        <p className="text-xs font-semibold">
          {config.label}
        </p>

        <p className="text-[10px] opacity-80">
          {config.subtitle}
        </p>
      </div>
    </div>
  );
}