'use client';

import { RecentActivityProps } from '@/types/admin';
import { COLOR_CLASSES, ACTIVITY_DOT_COLORS, UI_MESSAGES } from '@/constants/admin';
import ActivityItem from '../ui/ActivityItem';

/**
 * Recent activity timeline section
 */
export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className={`${COLOR_CLASSES.BG_CARD} rounded-lg border ${COLOR_CLASSES.BORDER} p-6`}>
      <h2 className="text-white text-base font-semibold mb-4">Recent activity</h2>
      {activities.length > 0 ? (
        <div className="space-y-0">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              title={activity.title}
              time={activity.time}
              dotColor={ACTIVITY_DOT_COLORS[activity.type]}
            />
          ))}
        </div>
      ) : (
        <div className={`${COLOR_CLASSES.TEXT_MUTED} text-sm text-center py-8`}>
          {UI_MESSAGES.NO_RECENT_ACTIVITY}
        </div>
      )}
    </div>
  );
}
