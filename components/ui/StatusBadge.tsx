import type { EnrollmentStatus } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatusBadgeProps {
  status: EnrollmentStatus;
}

// ─── Status Config Map ────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  EnrollmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Not started',
    className: 'bg-amber-950/60 text-amber-400 ring-1 ring-amber-500/20',
  },
  active: {
    label: 'In progress',
    className: 'bg-emerald-950/60 text-emerald-400 ring-1 ring-emerald-500/20',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-950/60 text-blue-300 ring-1 ring-blue-500/20',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}