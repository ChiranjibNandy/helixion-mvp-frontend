'use client';

import {
  BarChart2,
  BookOpen,
  ClipboardCheck,
  User,
} from 'lucide-react';

import { t } from '@/lib/i18n';
import { QuickAction } from '@/types/employee';
import { ROUTES } from '@/constants/navigation';

export const getQuickActions = (): QuickAction[] => [
  {
    title: t('employeeDashboard.quickActions.enroll.title'),
    description: t('employeeDashboard.quickActions.enroll.description'),
    linkText: t('employeeDashboard.quickActions.enroll.link'),
    href: ROUTES.EMPLOYEE.PROGRAMS,
    icon: <BookOpen className="w-5 h-5 text-blue-400" />,
    iconBg: 'bg-blue-500/15',
  },
  {
    title: t('employeeDashboard.quickActions.approvals.title'),
    description: t('employeeDashboard.quickActions.approvals.description'),
    linkText: t('employeeDashboard.quickActions.approvals.link'),
    href: ROUTES.EMPLOYEE.ENROLLMENTS,
    icon: <ClipboardCheck className="w-5 h-5 text-amber-400" />,
    iconBg: 'bg-amber-500/15',
  },
  {
    title: t('employeeDashboard.quickActions.reports.title'),
    description: t('employeeDashboard.quickActions.reports.description'),
    linkText: t('employeeDashboard.quickActions.reports.link'),
    href: ROUTES.EMPLOYEE.REPORTS,
    icon: <BarChart2 className="w-5 h-5 text-purple-400" />,
    iconBg: 'bg-purple-500/15',
  },
  {
    title: t('employeeDashboard.quickActions.profile.title'),
    description: t('employeeDashboard.quickActions.profile.description'),
    linkText: t('employeeDashboard.quickActions.profile.link'),
    href: ROUTES.EMPLOYEE.PROFILE,
    icon: <User className="w-5 h-5 text-slate-400" />,
    iconBg: 'bg-slate-500/15',
  },
];