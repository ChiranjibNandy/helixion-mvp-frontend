import ActivityItem from '@/components/ui/activity-item';
import { t } from '@/lib/i18n';
import { DashboardActivity } from '@/services/provider.service';
import { formatTime } from '@/utils/formatters';

interface RecentActivityListProps {
    activities: DashboardActivity[];
}

const DOT_COLORS: Record<string, string> = {
    published: 'bg-accentGreen',
    draft: 'bg-accentOrange',
    bulk_upload: 'bg-primary',
    enrollment: 'bg-primary',
    attendance: 'bg-accentRed',
};

export function RecentActivityList({ activities }: RecentActivityListProps) {
    const hasActivities = activities.length > 0;

    const getDotColor = (type: string) =>
        DOT_COLORS[type] ?? 'bg-textSecondary';

    return (
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col h-full min-h-[400px]">
            <div className="mb-6">
                <h2 className="text-card-foreground text-lg font-semibold">
                    {t('providerDashboard.recentActivity.title')}
                </h2>
                <p className="text-muted-foreground text-xs mt-1">
                    {t('providerDashboard.recentActivity.subtitle')}
                </p>
            </div>

            <div className="flex flex-col flex-1">
                {!hasActivities ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                        <p className="text-muted-foreground text-sm">
                            {t('common.noData')}
                        </p>
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <ActivityItem
                            key={`${activity.type}-${index}`}
                            title={activity.message}
                            time={formatTime(activity.time)}
                            dotColor={getDotColor(activity.type)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
