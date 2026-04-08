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
  IMPORT: '/import',
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

// Base navigation items (without dynamic values)
export const getNavigationConfig = (
  pendingCount: number,
  totalUsers: number
): NavigationSection[] => [
  {
    title: NAV_SECTIONS.OVERVIEW,
    items: [
      {
        icon: LayoutDashboard,
        label: NAV_LABELS.DASHBOARD,
        href: ROUTES.DASHBOARD,
        isActive: true,
      },
      {
        icon: BarChart3,
        label: NAV_LABELS.ANALYTICS,
        href: ROUTES.ANALYTICS,
      },
    ],
  },
  {
    title: NAV_SECTIONS.MANAGEMENT,
    items: [
      {
        icon: Users,
        label: NAV_LABELS.PENDING,
        href: ROUTES.PENDING,
        badge: pendingCount.toString(),
      },
      {
        icon: Users,
        label: NAV_LABELS.ALL_USERS,
        href: ROUTES.USERS,
        badge: totalUsers.toString(),
      },
      {
        icon: Shield,
        label: NAV_LABELS.ROLES_PERMISSIONS,
        href: ROUTES.ROLES,
      },
      {
        icon: FileText,
        label: NAV_LABELS.BULK_IMPORT,
        href: ROUTES.IMPORT,
      },
    ],
  },
  {
    title: NAV_SECTIONS.PLATFORM,
    items: [
      {
        icon: Settings,
        label: NAV_LABELS.PROGRAMS,
        href: ROUTES.PROGRAMS,
      },
      {
        icon: Zap,
        label: NAV_LABELS.ORGANIZATIONS,
        href: ROUTES.ORGANIZATIONS,
      },
      {
        icon: Bell,
        label: NAV_LABELS.AUDIT_LOG,
        href: ROUTES.AUDIT,
      },
    ],
  },
  {
    title: NAV_SECTIONS.GENERAL_TOOLS,
    items: [
      {
        icon: Settings,
        label: NAV_LABELS.SUPPORT,
        href: ROUTES.SUPPORT,
      },
      {
        icon: Bell,
        label: NAV_LABELS.INTEGRATIONS,
        href: ROUTES.INTEGRATIONS,
      },
      {
        icon: Bell,
        label: NAV_LABELS.NOTIFICATIONS,
        href: ROUTES.NOTIFICATIONS,
      },
    ],
  },
];

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
