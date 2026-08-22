import { CheckCircle, BookOpen, Clock, Plane } from 'lucide-react';
import { TrainingDeptDashboardSummary } from '@/types/trainingDept';

export function getTrainingDeptDashboardStats(summary?: Partial<TrainingDeptDashboardSummary>) {
  const s = summary ?? {};

  return [
    {
      title: 'Programs Completed',
      value: s.programsCompleted ?? 0,
      subtitle: s.programsCompleted ? 'All time' : 'No completions yet',
      subtitleColor: s.programsCompleted ? 'text-emerald-400' : 'text-textSidebarMuted',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      iconBg: 'bg-emerald-500/15',
    },
    {
      title: 'Programs Enrolled',
      value: s.programsEnrolled ?? 0,
      subtitle: s.programsEnrolled ? 'Currently active' : 'None enrolled',
      subtitleColor: 'text-textSidebarMuted',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      iconBg: 'bg-blue-500/15',
    },
    {
      title: 'Pending Approvals',
      value: s.pendingApprovals ?? 0,
      subtitle: 'Awaiting your review',
      subtitleColor: 'text-amber-400',
      badge: s.pendingApprovals ? 'Action Required' : undefined,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-amber-500/15',
    },
    {
      title: 'Pending Tour Approvals',
      value: s.pendingTourApprovals ?? 0,
      subtitle: s.pendingTourApprovals ? 'Awaiting your action' : 'None pending',
      subtitleColor: s.pendingTourApprovals ? 'text-amber-400' : 'text-textSidebarMuted',
      icon: <Plane className="w-5 h-5 text-violet-400" />,
      iconBg: 'bg-violet-500/15',
    },
  ];
}
