import type { User, Enrollment, Programme, NavSection } from '@/types';

// ─── Mock User ────────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id: 'u-001',
  name: 'Arjun Patel',
  initials: 'AP',
  location: 'Mumbai',
  campus: 'BKC Campus',
  role: 'employee',
  email: 'arjun.patel@helixion.com',
};

// ─── Mock Enrollments ─────────────────────────────────────────────────────────
export const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'e-001',
    name: 'Safety Compliance 101',
    meta: 'Starts 2 Apr · Andheri Training Centre',
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'e-002',
    name: 'Leadership Foundations',
    meta: 'Self-paced · Online',
    progress: 60,
    status: 'in_progress',
  },
  {
    id: 'e-003',
    name: 'Fire Safety Induction',
    meta: 'Completed 14 Mar · BKC Campus',
    progress: 100,
    status: 'completed',
  },
];

// ─── Mock Programmes ──────────────────────────────────────────────────────────
export const MOCK_PROGRAMMES: Programme[] = [
  {
    id: 'p-001',
    name: 'Advanced Excel for Operations',
    duration: '4 weeks',
    mode: 'Instructor-led',
    location: 'Andheri',
    distance: '3.2 km',
  },
  {
    id: 'p-002',
    name: 'Workplace Health & Safety',
    duration: '1 day',
    mode: 'In-person',
    location: 'BKC Campus',
    distance: 'On-site',
  },
  {
    id: 'p-003',
    name: 'Communication Skills',
    duration: 'Self-paced',
    mode: 'Online',
    location: 'Remote',
  },
  {
    id: 'p-004',
    name: 'Data Privacy Fundamentals',
    duration: '2 hrs',
    mode: 'Online',
    location: 'Remote',
  },
];

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