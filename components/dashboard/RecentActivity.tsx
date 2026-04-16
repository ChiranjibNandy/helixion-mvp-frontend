'use client';

import { RecentActivityProps } from '@/types/admin';
import { ACTIVITY_DOT_COLORS, UI_MESSAGES } from '@/constants/admin';
import { ADMIN_CONTENT } from '@/constants/content';
import ActivityItem from '../ui/activity-item';

/**
 * Recent activity timeline section
 */
export default function RecentActivity({ activities }: RecentActivityProps) {
  const { SECTIONS } = ADMIN_CONTENT.DASHBOARD;

  return (
    <div className="bg-bgStatCard rounded-lg border border-borderCard p-6">
      <h2 className="text-white text-base font-semibold mb-4">{SECTIONS.RECENT_ACTIVITY}</h2>
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
        <div className="text-textSidebarMuted text-sm text-center py-8">
          {UI_MESSAGES.NO_RECENT_ACTIVITY}
        </div>
      )}
    </div>
  );
}
