import { CheckCircle, BookOpen, Clock, Users } from 'lucide-react';
import { ManagerDashboardSummary } from '@/types/manager';

export function getManagerDashboardStats(summary?: Partial<ManagerDashboardSummary>) {
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
      title: 'Team Enrollments',
      value: s.teamEnrollments ?? 0,
      subtitle: s.teamEnrollments ? 'Across your team' : 'No enrollments',
      subtitleColor: 'text-textSidebarMuted',
      icon: <Users className="w-5 h-5 text-violet-400" />,
      iconBg: 'bg-violet-500/15',
    },
  ];
}
