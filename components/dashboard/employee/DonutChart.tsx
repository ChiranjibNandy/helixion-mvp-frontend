'use client';

import { buildDonutSegments } from '@/utils/approval-status';

interface DonutChartProps {
  approved: number;
  pending: number;
  rejected: number;
}

export function DonutChart({
  approved,
  pending,
  rejected,
}: DonutChartProps) {
  const r = 52;
  const cx = 64;
  const cy = 64;
  const gap = 3;

  const circumference = 2 * Math.PI * r;

  const segments = buildDonutSegments(
    approved,
    pending,
    rejected,
    circumference,
    gap
  );

  return (
    <svg
      viewBox="0 0 128 128"
      className="w-32 h-32"
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Background Ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#1e293b"
        strokeWidth="14"
      />

      {segments.map((segment, index) => (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={segment.color}
          strokeWidth="14"
          strokeDasharray={segment.dashArray}
          strokeDashoffset={segment.dashOffset}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
}