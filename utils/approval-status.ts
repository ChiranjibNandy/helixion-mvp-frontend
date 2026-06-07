import { ApprovalStats } from '@/types/employee';
import { t } from '@/lib/i18n';

export interface LegendItem {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

export interface ChartSegment {
  color: string;
  dashArray: string;
  dashOffset: number;
}

export function getApprovalTotal(stats: ApprovalStats): number {
  return (
    (stats.approved ?? 0) +
    (stats.pending ?? 0) +
    (stats.dismissed ?? 0) +
    (stats.null ?? 0)
  );
}

export function getLegendItems(
  approved: number,
  pending: number,
  rejected: number
): LegendItem[] {
  return [
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
}

export function buildDonutSegments(
  approved: number,
  pending: number,
  rejected: number,
  circumference: number,
  gap: number
): ChartSegment[] {
  const total = approved + pending + rejected || 1;

  const segments = [
    { value: approved, color: '#094d36' },
    { value: pending, color: '#f59e0b' },
    { value: rejected, color: '#f43f5e' },
  ];

  let cumulativeOffset = 0;

  return segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const segLength =
        (segment.value / total) * circumference;

      const gapLength =
        (gap / 360) * circumference;

      const result = {
        color: segment.color,
        dashArray: `${Math.max(
          segLength - gapLength,
          0
        )} ${circumference}`,
        dashOffset: -cumulativeOffset,
      };

      cumulativeOffset += segLength;

      return result;
    });
}