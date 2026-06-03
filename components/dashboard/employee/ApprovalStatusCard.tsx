'use client';

import { t } from "@/lib/i18n";
import { ApprovalStats } from "@/types/employee";

interface ApprovalStatusCardProps {
  stats: ApprovalStats;
}

interface LegendItem {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

function DonutChart({
  approved,
  pending,
  rejected,
}: {
  approved: number;
  pending: number;
  rejected: number;
}) {
  const total = approved + pending + rejected || 1;
  const r = 52;
  const cx = 64;
  const cy = 64;
  const circumference = 2 * Math.PI * r;

  // Build segments
  const segments = [
    { value: approved, color: '#10b981' },   // emerald
    { value: pending, color: '#f59e0b' },    // amber
    { value: rejected, color: '#f43f5e' },   // rose
  ];

  let cumulativeOffset = 0;
  // start from top (rotate -90deg)
  const gap = 3; // gap between segments in degrees

  return (
    <svg viewBox="0 0 128 128" className="w-32 h-32" style={{ transform: 'rotate(-90deg)' }}>
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#1e293b"
        strokeWidth="14"
      />
      {segments.map((seg, i) => {
        const segLength = (seg.value / total) * circumference;
        const gapLength = (gap / 360) * circumference;
        const dashArray = `${ Math.max(segLength - gapLength, 0) } ${ circumference }`;
        const dashOffset = -cumulativeOffset;
        cumulativeOffset += segLength;
        if (seg.value === 0) return null;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
}

export function ApprovalStatusCard({ stats }: ApprovalStatusCardProps) {
  const approved = stats.approved ?? 0;
  const pending = stats.pending ?? 0;
  const rejected = stats.dismissed ?? 0;
  const total = approved + pending + rejected + (stats.null ?? 0);

  const legendItems: LegendItem[] = [
    {
      label: t('approvalStatus.approved'),
      value: approved,
      color: 'bg-emerald-500',
      bgColor: 'text-emerald-400',
    },
    {
      label: t('approvalStatus.pending'),
      value: pending,
      color: 'bg-amber-500',
      bgColor: 'text-amber-400',
    },
    {
      label: t('approvalStatus.rejected'),
      value: rejected,
      color: 'bg-rose-500',
      bgColor: 'text-rose-400',
    },
  ];

  return (
    <div className="bg-bgCard border border-borderCard rounded-lg p-6 flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-white text-lg font-semibold"> {t('approvalStatus.title')}</h2>
        <p className="text-textSidebarMuted text-xs mt-1">{t('approvalStatus.subtitle')}</p>
      </div>

      <div className="flex flex-col items-center gap-6 flex-1">
        {/* Donut */}
        <div className="relative flex items-center justify-center">
          <DonutChart approved={approved} pending={pending} rejected={rejected} />
          <div className="absolute flex flex-col items-center">
            <span className="text-white text-xl font-bold">{total}</span>
            <span className="text-textSidebarMuted text-[10px]"> {t('approvalStatus.total')}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${ item.color }`} />
                <span className="text-textSecondary text-sm">{item.label}</span>
              </div>
              <span className={`text-sm font-semibold ${ item.bgColor }`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}