import ActivityItem from './ActivityItem';

interface Activity {
  id: string;
  title: string;
  time: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface RecentActivityProps {
  activities: Activity[];
}

const dotColors = {
  success: 'bg-[#16a34a]',
  error: 'bg-[#dc2626]',
  warning: 'bg-[#f59e0b]',
  info: 'bg-primary'
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-[#0f1629] rounded-lg border border-[#1a2235] p-6">
      <h2 className="text-white text-base font-semibold mb-4">Recent activity</h2>
      <div className="space-y-0">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            title={activity.title}
            time={activity.time}
            dotColor={dotColors[activity.type]}
          />
        ))}
      </div>
    </div>
  );
}
