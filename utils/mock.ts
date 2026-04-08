import type {  NavSection } from '@/types';


// ─── Nav Config ───────────────────────────────────────────────────────────────
export const NAV_SECTIONS: NavSection[] = [
  {
    category: 'Learning',
    items: [
      { label: 'My Enrollments', key: 'enrollments', href: '/dashboard/enrollments' },
      { label: 'Browse Programmes', key: 'browse', href: '/dashboard/browse' },
      { label: 'Certificates', key: 'certificates', href: '/dashboard/certificates' },
    ],
  },
  {
    category: 'Account',
    items: [
      { label: 'Profile & Location', key: 'profile', href: '/dashboard/profile' },
    ],
  },
];