import { NavSection } from "../types/employee";
import type { Filters } from '../types/employee-programs';

export const PAGE_SIZE = 10;

export const EMPTY_FILTERS: Filters = {
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
};

export const ROLE_LABEL: Record<string, string> = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Administrator',
  'training-provider': 'TRAINING PROVIDER',
};

export const EMP_NAV_SECTIONS: NavSection[] = [
  {
    category: 'Workspace',
    items: [
      {
        label: 'Dashboard',
        key: 'dashboard',
        href: '/dashboard',
        icon: 'layout-dashboard',
      },
      {
        label: 'Profile',
        key: 'profile',
        href: '/dashboard/profile',
        icon: 'user',
      },
      {
        label: 'Programs',
        key: 'programs',
        href: '/dashboard/programs',
        icon: 'book-open',
      },
      {
        label: 'Enrollments',
        key: 'enrollments',
        href: '/dashboard/enrollments',
        icon: 'download',
      },
      {
        label: 'Approvals',
        key: 'approvals',
        href: '/dashboard/approvals',
        icon: 'clipboard-check',
      },
      {
        label: 'Reports',
        key: 'reports',
        href: '/dashboard/reports',
        icon: 'bar-chart-3',
      },
    ],
  },
];