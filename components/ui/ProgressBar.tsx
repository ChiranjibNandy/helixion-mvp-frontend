// ─── Types ────────────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;           // 0–100
  className?: string;
  showLabel?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTrackColor(value: number): string {
  if (value === 100) return 'bg-blue-400';
  if (value > 0)    return 'bg-emerald-400';
  return 'bg-amber-400';
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ProgressBar({ value, className = '', showLabel = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex flex-col items-end gap-0.5 ${className}`}>
      {showLabel && (
        <span className="text-[9px] text-white/30 tabular-nums">{clamped}%</span>
      )}
      <div className="w-full h-1 rounded-full bg-white/8 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getTrackColor(clamped)}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}