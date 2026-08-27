import { CheckCircle, BookOpen, Clock, Plane } from 'lucide-react';
import { TrainingDeptDashboardSummary } from '@/types/trainingDept';
import { t } from '@/lib/i18n';

export function getTrainingDeptDashboardStats(summary?: Partial<TrainingDeptDashboardSummary>) {
  const s = summary ?? {};

  return [
    {
      title: t('trainingDeptDashboard.stats.programsCompleted'),
      value: s.programsCompleted ?? 0,
      subtitle: s.programsCompleted
        ? t('trainingDeptDashboard.stats.programsCompletedSubtitleAll')
        : t('trainingDeptDashboard.stats.programsCompletedSubtitleNone'),
      subtitleColor: s.programsCompleted ? 'text-emerald-400' : 'text-textSidebarMuted',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      iconBg: 'bg-emerald-500/15',
    },
    {
      title: t('trainingDeptDashboard.stats.programsEnrolled'),
      value: s.programsEnrolled ?? 0,
      subtitle: s.programsEnrolled
        ? t('trainingDeptDashboard.stats.programsEnrolledSubtitleActive')
        : t('trainingDeptDashboard.stats.programsEnrolledSubtitleNone'),
      subtitleColor: 'text-textSidebarMuted',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      iconBg: 'bg-blue-500/15',
    },
    {
      title: t('trainingDeptDashboard.stats.pendingApprovals'),
      value: s.pendingApprovals ?? 0,
      subtitle: t('trainingDeptDashboard.stats.pendingApprovalsSubtitle'),
      subtitleColor: 'text-amber-400',
      badge: s.pendingApprovals ? t('trainingDeptDashboard.stats.pendingApprovalsBadge') : undefined,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-amber-500/15',
    },
    {
      title: t('trainingDeptDashboard.stats.pendingTourApprovals'),
      value: s.pendingTourApprovals ?? 0,
      subtitle: s.pendingTourApprovals
        ? t('trainingDeptDashboard.stats.pendingTourApprovalsSubtitleWaiting')
        : t('trainingDeptDashboard.stats.pendingTourApprovalsSubtitleNone'),
      subtitleColor: s.pendingTourApprovals ? 'text-amber-400' : 'text-textSidebarMuted',
      icon: <Plane className="w-5 h-5 text-violet-400" />,
      iconBg: 'bg-violet-500/15',
    },
  ];
}
