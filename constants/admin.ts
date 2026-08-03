// Constants for admin dashboard

import { NavSection } from "@/types/employee";
import { NAV_LABELS, NAV_SECTIONS } from "./content";
import { ROUTES } from "./navigation";



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
  DAYS_AGO: (days: number) => `${days} days ago`,
} as const;



// constants/admin.ts

// Items below are commented out (not deleted) because no corresponding page
// exists under app/admin/** — every one of them 404'd. Uncomment an entry
// once its page is actually built.
export const ADMIN_NAV_SECTION: NavSection[] = [
  {
    category: NAV_SECTIONS.OVERVIEW,
    items: [
      {
        label: NAV_LABELS.DASHBOARD,
        key: 'dashboard',
        href: ROUTES.DASHBOARD.ADMIN,
        icon: 'layout-dashboard',
      },
      {
        // Ticket 0041 — always enabled; this is the screen that unlocks
        // the other org-dependent items below (e.g. Bulk Import), so it
        // can't itself be gated on the thing it sets up.
        label: 'Org Policy Setup',
        key: 'org-policy',
        href: ROUTES.ADMIN.ORG_POLICY_SETUP,
        icon: 'zap',
      },
      // {
      //   label: NAV_LABELS.ANALYTICS,
      //   key: 'analytics',
      //   href: ROUTES.ADMIN.ANALYTICS,
      //   icon: 'bar-chart',
      // },
    ],
  },
  {
    category: NAV_SECTIONS.MANAGEMENT,
    items: [
      // {
      //   label: NAV_LABELS.PENDING,
      //   key: 'pending',
      //   href: ROUTES.ADMIN.PENDING,
      //   icon: 'users',
      // },
      // {
      //   label: NAV_LABELS.ALL_USERS,
      //   key: 'users',
      //   href: ROUTES.ADMIN.USERS,
      //   icon: 'users',
      // },
      // {
      //   label: NAV_LABELS.ROLES_PERMISSIONS,
      //   key: 'roles',
      //   href: ROUTES.ADMIN.ROLES,
      //   icon: 'shield',
      // },
      {
        label: NAV_LABELS.BULK_IMPORT,
        key: 'import',
        href: ROUTES.ADMIN.IMPORT,
        icon: 'file',
      },
      {
        // Bulk upload requires every row to have a Reporting Manager Email —
        // this is the only way to create the one person any org hierarchy
        // needs at its root (nobody above them). Same org-policy gating as
        // Bulk Import, since it also needs admin.orgId to be set.
        label: 'Add Employee',
        key: 'add-employee',
        href: ROUTES.ADMIN.ADD_EMPLOYEE,
        icon: 'plus-circle',
      },
      {
        label: NAV_LABELS.RESET_PASSWORD,
        key: 'reset-password',
        href: ROUTES.ADMIN.RESET_PASSWORD,
        icon: 'key-round',
      },
      {
        label: NAV_LABELS.DEACTIVATE_USER,
        key: 'deactivate',
        href: ROUTES.ADMIN.DEACTIVATE_USER,
        icon: 'user-circle',
      },
    ],
  },
  // {
  //   category: NAV_SECTIONS.PLATFORM,
  //   items: [
  //     {
  //       label: NAV_LABELS.PROGRAMS,
  //       key: 'programs',
  //       href: ROUTES.ADMIN.PROGRAMS,
  //       icon: 'settings',
  //     },
  //     {
  //       label: NAV_LABELS.ORGANIZATIONS,
  //       key: 'organizations',
  //       href: ROUTES.ADMIN.ORGANIZATIONS,
  //       icon: 'zap',
  //     },
  //     {
  //       label: NAV_LABELS.AUDIT_LOG,
  //       key: 'audit',
  //       href: ROUTES.ADMIN.AUDIT,
  //       icon: 'bell',
  //     },
  //   ],
  // },
  // {
  //   category: NAV_SECTIONS.GENERAL_TOOLS,
  //   items: [
  //     {
  //       icon: "settings",
  //       key: 'support',
  //       label: NAV_LABELS.SUPPORT,
  //       href: ROUTES.ADMIN.SUPPORT,
  //     },
  //     {
  //       icon: "bell",
  //       key: 'integrations',
  //       label: NAV_LABELS.INTEGRATIONS,
  //       href: ROUTES.ADMIN.INTEGRATIONS,
  //     },
  //     {
  //       icon: "bell",
  //       key: 'notifications',
  //       label: NAV_LABELS.NOTIFICATIONS,
  //       href: ROUTES.ADMIN.NOTIFICATIONS,
  //     },
  //   ],
  // },
];


