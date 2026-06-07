'use client';

import { t } from '@/lib/i18n';
import { ApprovalStats } from '@/types/employee';

import {
  buildDonutSegments,
  getApprovalTotal,
  getLegendItems,
} from '@/utils/approval-status';

interface ApprovalStatusCardProps {
  stats: ApprovalStats;
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

export function ApprovalStatusCard({
  stats,
}: ApprovalStatusCardProps) {
  const approved = stats.approved ?? 0;
  const pending = stats.pending ?? 0;
  const rejected = stats.dismissed ?? 0;

  const total = getApprovalTotal(stats);

  const legendItems = getLegendItems(
    approved,
    pending,
    rejected
  );

  return (
    <div className="bg-bgCard border border-borderCard rounded-lg p-6 flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-white text-lg font-semibold">
          {t('approvalStatus.title')}
        </h2>

        <p className="text-textSidebarMuted text-xs mt-1">
          {t('approvalStatus.subtitle')}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 flex-1">
        <div className="relative flex items-center justify-center">
          <DonutChart
            approved={approved}
            pending={pending}
            rejected={rejected}
          />

          <div className="absolute flex flex-col items-center">
            <span className="text-white text-xl font-bold">
              {total}
            </span>

            <span className="text-textSidebarMuted text-[10px]">
              {t('approvalStatus.total')}
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                />

                <span className="text-textSecondary text-sm">
                  {item.label}
                </span>
              </div>

              <span
                className={`text-sm font-semibold ${item.bgColor}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}