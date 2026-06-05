import { NavSection } from "../types/employee";

export const ROLE_LABEL: Record<string, string> = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Administrator',
  'training-provider': 'TRAINING PROVIDER',
};

export const EMP_NAV_SECTIONS: NavSection[] = [
  {
    category: 'Learning',
    items: [
      {
        label: 'Programs',
        key: 'programs',
        href: '/dashboard/programs',
        icon: 'file-text',
      },
      {
        label: 'My Enrollments',
        key: 'enrollments',
        href: '/dashboard/enrollments',
        icon: 'book-open',
      },
      {
        label: 'Browse Programmes',
        key: 'browse',
        href: '/dashboard/browse',
        icon: 'search',
      },
      {
        label: 'Certificates',
        key: 'certificates',
        href: '/dashboard/certificates',
        icon: 'award',
      },
    ],
  },
  {
    category: 'Account',
    items: [
      {
        label: 'Profile & Location',
        key: 'profile',
        href: '/dashboard/profile',
        icon: 'user-circle',
      },
    ],
  },
];