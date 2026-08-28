'use client';

import { BookOpen, ClipboardCheck, Plane, BarChart2, User } from 'lucide-react';
import { QuickAction } from '@/types/employee';
import { t } from '@/lib/i18n';

export const getTrainingDeptQuickActions = (): QuickAction[] => [
  {
    title: t('trainingDeptDashboard.quickActions.enroll.title'),
    description: t('trainingDeptDashboard.quickActions.enroll.description'),
    linkText: t('trainingDeptDashboard.quickActions.enroll.link'),
    href: '/dashboard/programs',
    icon: <BookOpen className="w-5 h-5 text-blue-400" />,
    iconBg: 'bg-blue-500/15',
  },
  {
    title: t('trainingDeptDashboard.quickActions.ctdApprovals.title'),
    description: t('trainingDeptDashboard.quickActions.ctdApprovals.description'),
    linkText: t('trainingDeptDashboard.quickActions.ctdApprovals.link'),
    href: '/dashboard/ctd-approvals',
    icon: <ClipboardCheck className="w-5 h-5 text-amber-400" />,
    iconBg: 'bg-amber-500/15',
  },
  {
    title: t('trainingDeptDashboard.quickActions.tourApprovals.title'),
    description: t('trainingDeptDashboard.quickActions.tourApprovals.description'),
    linkText: t('trainingDeptDashboard.quickActions.tourApprovals.link'),
    href: '/dashboard/tour-approvals',
    icon: <Plane className="w-5 h-5 text-violet-400" />,
    iconBg: 'bg-violet-500/15',
  },
  {
    title: t('trainingDeptDashboard.quickActions.reports.title'),
    description: t('trainingDeptDashboard.quickActions.reports.description'),
    linkText: t('trainingDeptDashboard.quickActions.reports.link'),
    href: '/dashboard/reports',
    icon: <BarChart2 className="w-5 h-5 text-purple-400" />,
    iconBg: 'bg-purple-500/15',
  },
  {
    title: t('trainingDeptDashboard.quickActions.profile.title'),
    description: t('trainingDeptDashboard.quickActions.profile.description'),
    linkText: t('trainingDeptDashboard.quickActions.profile.link'),
    href: '/dashboard/profile',
    icon: <User className="w-5 h-5 text-slate-400" />,
    iconBg: 'bg-slate-500/15',
  },
];
