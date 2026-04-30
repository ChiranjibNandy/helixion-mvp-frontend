// Constants for admin dashboard

import { NavSection } from "@/types/employee";
import { NAV_LABELS, NAV_SECTIONS } from "./content";
import { BarChart3, Bell, FileText, LayoutDashboard, Settings, Shield, Users, Zap } from "lucide-react";
import { ROUTES } from "./navigation";

export const API_ENDPOINTS = {
  REGISTRATIONS: '/admin/registrations',
  USERS: '/admin/users',
  DEACTIVATE_USER: (id: string) => `/admin/users/${id}/deactivate`,
} as const;

// Activity dot colors using semantic Tailwind classes
export const ACTIVITY_DOT_COLORS = {
  success: 'bg-accentGreen',
  error: 'bg-accentRed',
  warning: 'bg-accentOrange',
  info: 'bg-primary',
} as const;

// Semantic color classes - all using Tailwind theme tokens
export const COLOR_CLASSES = {
  TEXT_MUTED: 'text-textSidebarMuted',
  TEXT_SECONDARY: 'text-textSecondary',
  TEXT_BLUE: 'text-blue-400',
  TEXT_WARNING: 'text-accentOrange',
  BG_MAIN: 'bg-bgMain',
  BG_CARD: 'bg-bgStatCard',
  BG_DARK: 'bg-bgSidebar',
  BORDER: 'border-borderCard',
  PRIMARY: 'primary',
} as const;

export const UI_MESSAGES = {
  LOADING: 'Loading...',
  LOADING_REGISTRATIONS: 'Loading registrations...',
  NO_RECENT_ACTIVITY: 'No recent activity',
  DATA_UNAVAILABLE: 'Data unavailable',
  NEEDS_ACTION: 'Needs action',
  ALL_TIME: 'All time',
  COMING_SOON: 'Coming soon',
} as const;

// Avatar background colors using semantic Tailwind classes
export const AVATAR_BACKGROUNDS = [
  'bg-avatarBlue',
  'bg-avatarGreen',
  'bg-avatarOrange',
  'bg-avatarYellow',
] as const;

export const DATE_FORMATS = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  DAYS_AGO: (days: number) => `${ days } days ago`,
} as const;



// constants/admin.ts

export const ADMIN_NAV_SECTION: NavSection[] = [
  {
    category: NAV_SECTIONS.OVERVIEW,
    items: [
      {
        label: NAV_LABELS.DASHBOARD,
        key: 'dashboard',
        href: ROUTES.ADMIN_DASHBOARD,
        icon: 'layout-dashboard',
      },
      {
        label: NAV_LABELS.ANALYTICS,
        key: 'analytics',
        href: ROUTES.ANALYTICS,
        icon: 'bar-chart',
      },
    ],
  },
  {
    category: NAV_SECTIONS.MANAGEMENT,
    items: [
      {
        label: NAV_LABELS.PENDING,
        key: 'pending',
        href: ROUTES.PENDING,
        icon: 'users',
      },
      {
        label: NAV_LABELS.ALL_USERS,
        key: 'users',
        href: ROUTES.USERS,
        icon: 'users',
      },
      {
        label: NAV_LABELS.ROLES_PERMISSIONS,
        key: 'roles',
        href: ROUTES.ROLES,
        icon: 'shield',
      },
      {
        label: NAV_LABELS.BULK_IMPORT,
        key: 'import',
        href: ROUTES.IMPORT,
        icon: 'file',
      },
      {
        label: NAV_LABELS.RESET_PASSWORD,
        key: 'reset_password',
        href: '#',
        icon: 'shield',
      },
      {
        label: NAV_LABELS.DEACTIVATE_USER,
        key: 'deactivate',
        href: ROUTES.DEACTIVATE_USER,
        icon: 'user-circle',
      },
    ],
  },
  {
    category: NAV_SECTIONS.PLATFORM,
    items: [
      {
        label: NAV_LABELS.PROGRAMS,
        key: 'programs',
        href: ROUTES.PROGRAMS,
        icon: 'settings',
      },
      {
        label: NAV_LABELS.ORGANIZATIONS,
        key: 'organizations',
        href: ROUTES.ORGANIZATIONS,
        icon: 'zap',
      },
      {
        label: NAV_LABELS.AUDIT_LOG,
        key: 'audit',
        href: ROUTES.AUDIT,
        icon: 'bell',
      },
    ],
  },
  {
    category: NAV_SECTIONS.GENERAL_TOOLS,
    items: [
      {
        icon: "settings",
        key: 'support',
        label: NAV_LABELS.SUPPORT,
        href: ROUTES.SUPPORT,
      },
      {
        icon: "bell",
        key: 'integrations',
        label: NAV_LABELS.INTEGRATIONS,
        href: ROUTES.INTEGRATIONS,
      },
      {
        icon: "bell",
        key: 'notifications',
        label: NAV_LABELS.NOTIFICATIONS,
        href: ROUTES.NOTIFICATIONS,
      },
    ],
  },
];


