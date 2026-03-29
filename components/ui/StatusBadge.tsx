import { cn } from "@/lib/utils";

export type StatusVariant = "pending" | "active" | "inactive" | "neutral";

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

const badgeStyles: Record<StatusVariant, string> = {
  active: "bg-statusActiveBg text-statusActive",
  pending: "bg-statusPendingBg text-statusPending",
  inactive: "bg-statusInactiveBg text-statusInactive",
  neutral: "bg-bgHover text-textSecondary",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  // Use capitalized status name if label not provided
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeStyles[status],
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
