import {
  BookOpen,
  FileText,
  TrendingUp,
  Users,
} from 'lucide-react';

import { t } from '@/lib/i18n';
import { ProviderDashboardResponse } from '@/services/provider.service';

export function getProviderDashboardStats(
  overview: ProviderDashboardResponse['overview']
) {
  return [
    {
      title: t('providerDashboard.stats.livePrograms'),
      value: overview.livePrograms,
      subtitle: t('providerDashboard.stats.allPublished'),
      subtitleColor: 'text-accentGreen',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      iconBg: 'bg-blue-500/15',
    },
    {
      title: t('providerDashboard.stats.totalEnrolled'),
      value: overview.totalEnrollments,
      subtitle: t(
        'providerDashboard.stats.acrossPrograms',
        {
          count: overview.livePrograms,
        }
      ),
      subtitleColor: 'text-textSidebarMuted',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      iconBg: 'bg-emerald-500/15',
    },
    {
      title: t('providerDashboard.stats.drafts'),
      value: overview.drafts,
      subtitle: t(
        'providerDashboard.stats.awaitingPublish'
      ),
      subtitleColor: 'text-accentOrange',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-amber-500/15',
    },
    {
      title: t('providerDashboard.stats.avgFillRate'),
      value: `${overview.averageFillRate}%`,
      subtitle: t(
        'providerDashboard.stats.capacityUtilized'
      ),
      subtitleColor: 'text-accentGreen',
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      iconBg: 'bg-green-500/15',
    },
  ];
}