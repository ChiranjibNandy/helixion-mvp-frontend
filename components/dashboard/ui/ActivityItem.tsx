import { ActivityItemProps } from '@/types/admin';
import { COLOR_CLASSES } from '@/constants/admin';

/**
 * Individual activity item component for timeline display
 */
export default function ActivityItem({ title, time, dotColor }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`w-2 h-2 rounded-full mt-1.5 ${dotColor}`}></div>
      <div className="flex-1">
        <div className={`${COLOR_CLASSES.TEXT_SECONDARY} text-sm leading-relaxed`}>{title}</div>
        <div className={`${COLOR_CLASSES.TEXT_MUTED} text-xs mt-1`}>{time}</div>
      </div>
    </div>
  );
}