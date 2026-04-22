// Navigation configuration and constants

import {
  LayoutDashboard,
  BarChart3,
  Users,
  Shield,
  FileText,
  Settings,
  Zap,
  Bell,
} from 'lucide-react';
import { NAV_SECTIONS, NAV_LABELS } from './content';

// Route paths - single source of truth for all routes
export const ROUTES = {
  // Auth routes
  SIGNIN: '/signin',
  SIGNUP: '/signup',

  // Main routes
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',

  // Admin routes
  ANALYTICS: '/analytics',
  PENDING: '/pending',
  USERS: '/users',
  ROLES: '/roles',
  IMPORT: '/admin/dashboard/import',
  PROGRAMS: '/programs',
  ORGANIZATIONS: '/organizations',
  AUDIT: '/audit',
  SUPPORT: '/support',
  INTEGRATIONS: '/integrations',
  NOTIFICATIONS: '/notifications',
} as const;

// Navigation item type - using Lucide icon type
export interface NavigationItem {
  icon: React.ComponentType<{ size?: number | string }>;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

// Navigation section type
export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}


// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Role-based route access
export const ROLE_ACCESS = {
  [USER_ROLES.ADMIN]: [
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ANALYTICS,
    ROUTES.PENDING,
    ROUTES.USERS,
    ROUTES.ROLES,
    ROUTES.IMPORT,
    ROUTES.PROGRAMS,
    ROUTES.ORGANIZATIONS,
    ROUTES.AUDIT,
  ],
  [USER_ROLES.USER]: [ROUTES.DASHBOARD],
} as const;
