import {  User } from "@/types";
import { NavSection } from "../types/employee";
import { Award, BookOpen, Search, UserCircle } from "lucide-react";

// role value correspond display in UI
export const ROLE_LABEL: Record<User['role'], string> = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Administrator',
};


// ─── Employment Navigation ───────────────────────────────────────────────────────────────
// constants/employee.ts

export const EMP_NAV_SECTIONS: NavSection[] = [
  {
    category: 'Learning',
    items: [
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