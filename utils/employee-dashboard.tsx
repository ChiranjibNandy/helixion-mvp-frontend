import { t } from '@/lib/i18n';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

export function getEmployeeDashboardStats(summary: {
  programsCompleted: number;
  programsEnrolled: number;
  pendingApprovals: number;
}) {
  return [
    {
      title: t('employeeDashboard.stats.programsCompleted'),
      value: summary.programsCompleted,
      subtitle: t('employeeDashboard.stats.completedSubtitle'),
      subtitleColor: 'text-emerald-400',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      iconBg: 'bg-emerald-500/15',
    },
    {
      title: t('employeeDashboard.stats.programsEnrolled'),
      value: summary.programsEnrolled,
      subtitle: t(
        'employeeDashboard.stats.enrolledInProgress',
        {
          count: Math.min(summary.programsEnrolled, 2),
        }
      ),
      subtitleColor: 'text-textSidebarMuted',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      iconBg: 'bg-blue-500/15',
    },
    {
      title: t('employeeDashboard.stats.pendingApprovals'),
      value: summary.pendingApprovals,
      subtitle: t('employeeDashboard.stats.pendingSubtitle'),
      subtitleColor: 'text-textSidebarMuted',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-amber-500/15',
    },
  ];
}