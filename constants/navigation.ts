// Route paths - single source of truth for all routes
export const ROUTES = {
  // Auth routes
  AUTH: {
    SIGNIN: '/signin',
    SIGNUP: '/signup',
  },

  // Main dashboard routes
  DASHBOARD: {
    ROOT: '/dashboard',
    ADMIN: '/admin/dashboard',
  },

  // Admin section routes
  ADMIN: {
    ANALYTICS: '/analytics',
    PENDING: '/pending',
    USERS: '/users',
    ROLES: '/roles',
    IMPORT: '/admin/dashboard/import',
    RESET_PASSWORD: '/admin/reset-password',
    PROGRAMS: '/programs',
    ORGANIZATIONS: '/organizations',
    AUDIT: '/audit',
    SUPPORT: '/support',
    INTEGRATIONS: '/integrations',
    NOTIFICATIONS: '/notifications',
    DEACTIVATE_USER: '/admin/dashboard/deactivate',
  },

  // Employee section routes
  EMPLOYEE: {
    DASHBOARD:   '/dashboard',
    PROFILE:     '/dashboard/profile',
    PROGRAMS:    '/dashboard/programs',
    ENROLLMENTS: '/dashboard/enrollments',
    APPROVALS:   '/dashboard/approvals',
    EXPENSES:    '/dashboard/expenses',
    REPORTS:     '/dashboard/reports',
  },

  // Training Provider section routes
  PROVIDER: {
    DASHBOARD: '/dashboard',
    PROGRAMS: {
      ROOT: '/dashboard/programs',
      BULK: '/dashboard/programs/bulk',
      DRAFTS: '/dashboard/programs/drafts',
      ACTIVE: '/dashboard/programs/active',
      CREATE: '/dashboard/programs/create',
      EXPORT: '/dashboard/programs/export',
    },
    ATTENDANCE: '/dashboard/update-attendance',
  },
  EMPLOYEE: {
    PROGRAM: '/employee/programs'
  }
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
  EMPLOYEE: 'employee',
  TRAINING_PROVIDER: 'training-provider'
} as const;

// Role-based route access
export const ROLE_ACCESS = {
  [USER_ROLES.ADMIN]: [
    ROUTES.DASHBOARD.ADMIN,
    ROUTES.ADMIN.ANALYTICS,
    ROUTES.ADMIN.PENDING,
    ROUTES.ADMIN.USERS,
    ROUTES.ADMIN.ROLES,
    ROUTES.ADMIN.IMPORT,
    ROUTES.ADMIN.PROGRAMS,
    ROUTES.ADMIN.ORGANIZATIONS,
    ROUTES.ADMIN.AUDIT,
  ],
  [USER_ROLES.USER]: [ROUTES.DASHBOARD.ROOT],
  [USER_ROLES.TRAINING_PROVIDER]: [ROUTES.DASHBOARD.ROOT, ROUTES.PROVIDER.PROGRAMS.BULK],
} as const;


export const DEFAULT_KEY = {
  ENROLLMENTS: "enrollments",
  DASHBOARD: "dashboard"
}
