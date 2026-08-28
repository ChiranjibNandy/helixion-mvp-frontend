'use client';

import { BookOpen, ClipboardCheck } from 'lucide-react';
import { QuickAction } from '@/types/employee';

export const getManagerQuickActions = (): QuickAction[] => [
  {
    title: 'Enroll in Program',
    description: 'Browse listed trainings',
    linkText: 'Browse Programs',
    href: '/dashboard/programs',
    icon: <BookOpen className="w-5 h-5 text-blue-400" />,
    iconBg: 'bg-blue-500/15',
  },
  {
    title: 'Approve Enrollments',
    description: 'Review and act on pending requests from your team',
    linkText: 'Review Queue',
    href: '/dashboard/approvals',
    icon: <ClipboardCheck className="w-5 h-5 text-amber-400" />,
    iconBg: 'bg-amber-500/15',
  },
  // {
  //   title: 'View Reports',
  //   description: 'Analytics & summaries',
  //   linkText: 'View Reports',
  //   href: '/dashboard/reports',
  //   icon: <BarChart2 className="w-5 h-5 text-purple-400" />,
  //   iconBg: 'bg-purple-500/15',
  // },
  // 'My Profile' is commented out (not deleted) — no page exists at
  // '/dashboard/profile', so this card 404'd. Uncomment once the page is
  // actually built.
  // {
  //   title: 'My Profile',
  //   description: 'Update your details',
  //   linkText: 'View Profile',
  //   href: '/dashboard/profile',
  //   icon: <User className="w-5 h-5 text-slate-400" />,
  //   iconBg: 'bg-slate-500/15',
  // },
];
