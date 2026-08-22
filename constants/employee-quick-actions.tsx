'use client';

import {
  BookOpen,
  ClipboardCheck,
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
  // 'Reports' is commented out (not deleted) — no page exists at
  // ROUTES.EMPLOYEE.REPORTS ('/dashboard/reports'), so this card 404'd.
  // Mirrors the same card already disabled in manager-quick-actions.tsx.
  // Uncomment once the page is actually built.
  // {
  //   title: t('employeeDashboard.quickActions.reports.title'),
  //   description: t('employeeDashboard.quickActions.reports.description'),
  //   linkText: t('employeeDashboard.quickActions.reports.link'),
  //   href: ROUTES.EMPLOYEE.REPORTS,
  //   icon: <BarChart2 className="w-5 h-5 text-purple-400" />,
  //   iconBg: 'bg-purple-500/15',
  // },
  // 'Profile' is commented out (not deleted) — no page exists at
  // ROUTES.EMPLOYEE.PROFILE ('/dashboard/profile'), so this card 404'd.
  // Mirrors the sidebar nav item already disabled in constants/employee.ts.
  // Uncomment once the page is actually built.
  // {
  //   title: t('employeeDashboard.quickActions.profile.title'),
  //   description: t('employeeDashboard.quickActions.profile.description'),
  //   linkText: t('employeeDashboard.quickActions.profile.link'),
  //   href: ROUTES.EMPLOYEE.PROFILE,
  //   icon: <User className="w-5 h-5 text-slate-400" />,
  //   iconBg: 'bg-slate-500/15',
  // },
];