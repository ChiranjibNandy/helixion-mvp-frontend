import { NavItem, User } from "@/types";
import { EmpNavSection } from "./Type";
import { Award, BookOpen, Search, UserCircle } from "lucide-react";

// role value correspond display in UI
export const ROLE_LABEL: Record<User['role'], string> = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Administrator',
};


// ─── Employment Navigation ───────────────────────────────────────────────────────────────
export const EMP_NAV_SECTIONS: EmpNavSection[] = [
  {
    category: 'Learning',
    items: [
      { label: 'My Enrollments', key: 'enrollments', href: '/dashboard/enrollments',icon: BookOpen },
      { label: 'Browse Programmes', key: 'browse', href: '/dashboard/browse' ,icon: Search },
      { label: 'Certificates', key: 'certificates', href: '/dashboard/certificates',icon:Award },
    ],
  },
  {
    category: 'Account',
    items: [
      { label: 'Profile & Location', key: 'profile', href: '/dashboard/profile',icon:UserCircle },
    ],
  },
];