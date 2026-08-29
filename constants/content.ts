// Content constants for UI text and static data

import { StayType } from "@/types";

// Sign In page content
export const SIGNIN_CONTENT = {
  BADGES: [
    { icon: 'shield', label: 'Secure' },
    { icon: 'shield', label: 'Compliant' },
    { icon: 'star', label: 'Reliable' },
  ] as const,
  HEADLINE: {
    LINE_1: 'THE COMPLETE PLATFORM',
    LINE_2_PLAIN: 'FOR ',
    LINE_2_ACCENT: 'CORPORATE TRAINING.',
  },
  DESCRIPTION:
    'Unify discovery, approvals, attendance, and payments in a single, secure workflow platform built for enterprises.',
  FEATURES: [
    {
      icon: 'book-open',
      title: 'DISCOVER',
      description: 'Access programs from trusted training providers.',
    },
    {
      icon: 'shield-check',
      title: 'APPROVE',
      description: 'Automate multi-level approvals with full transparency.',
    },
    {
      icon: 'bar-chart',
      title: 'MANAGE',
      description: 'Track attendance, certificates and seat reservations.',
    },
    {
      icon: 'wallet',
      title: 'PAY & CLOSE',
      description: 'Invoices, payments and ERP integration in one seamless flow.',
    },
  ] as const,
  TRUST_ITEMS: [
    { icon: 'lock', label: 'Role-based access' },
    { icon: 'shield', label: 'Enterprise grade security' },
    { icon: 'file-check', label: 'Audit ready' },
    { icon: 'cloud', label: 'Scalable & reliable' },
  ] as const,
  TRUSTED_BY: {
    EYEBROW: 'TRUSTED BY LEADING ENTERPRISES',
    // Placeholder wordmarks — swap for real logo assets once actual
    // enterprise customers/partners are confirmed (see chat: don't imply
    // endorsement by named companies without a real relationship).
    LOGOS: ['Northbridge', 'Meridian', 'Vertex Industries', 'Solstice', 'Atlas Group', 'Primeworks'] as const,
  },
  FORM: {
    TITLE: 'Welcome Back',
    SUBTITLE: 'Sign in to continue to your workspace',
    EMAIL_LABEL: 'Email',
    EMAIL_PLACEHOLDER: 'you@company.com',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: 'Enter your password',
    FORGOT_PASSWORD: 'Forgot password?',
    SUBMIT_BUTTON: 'Sign In →',
    OR_DIVIDER: 'OR',
    NO_ACCOUNT: "Don't have an account?",
    CREATE_ACCOUNT: 'Create account →',
  },
  FOOTER: {
    COPYRIGHT: `© ${new Date().getFullYear()} Helixon Technologies Pvt. Ltd. All rights reserved.`,
    LINKS: ['Privacy Policy', 'Terms of Service', 'Support'] as const,
  },
} as const;

// Sign Up page content
export const SIGNUP_CONTENT = {
  FEATURES: [
    'Role-based dashboard tailored to your job',
    'Real-time training analytics & reports',
    'Enterprise SSO & team management',
    'SOC 2 compliant — your data stays safe',
  ] as const,
  LEFT_PANEL: {
    HEADLINE: 'Your workspace, ready in seconds.',

  },
  FORM: {
    TITLE: 'Create your account',
    SUBTITLE: 'Set up your workspace to get started',
    USERNAME_LABEL: 'Username',
    USERNAME_PLACEHOLDER: 'johndoe',
    EMAIL_LABEL: 'Work Email',
    EMAIL_PLACEHOLDER: 'you@company.com',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: 'Min. 8 characters',
    CONFIRM_PASSWORD_LABEL: 'Confirm Password',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Repeat your password',
    SUBMIT_BUTTON: '→ Create Account',
    HAS_ACCOUNT: 'Already have an account?',
    SIGN_IN: 'Sign in →',
  },
} as const;

// Brand content
export const BRAND = {
  NAME: 'Helixon',
  LOGO_TEXT: 'He',
  LOGO_SHORT: 'Hx',
  TAGLINE: 'Enterprise Learning Platform',
} as const;

// Admin dashboard content
export const ADMIN_CONTENT = {
  SIDEBAR: {
    PROFILE: {
      NAME: 'Admin',
      ACTION: 'View profile',
      INITIALS: 'AD',
    },
  },
  DASHBOARD: {
    TITLE: 'Admin dashboard',
    STATS: {
      TOTAL_USERS: 'Total users',
      ACTIVE_USERS: 'Active users',
      PENDING_APPROVAL: 'Pending approval',
      DEACTIVATED: 'Deactivated',
    },
    SECTIONS: {
      PENDING_REGISTRATIONS: 'Pending registrations',
      SEE_ALL: 'See all',
      RECENT_ACTIVITY: 'Recent activity',
    },
  },
} as const;

// Navigation section titles
export const NAV_SECTIONS = {
  OVERVIEW: 'Overview',
  MANAGEMENT: 'Management',
  PLATFORM: 'Platform',
  GENERAL_TOOLS: 'General tools',
} as const;

// Navigation item labels
export const NAV_LABELS = {
  DASHBOARD: 'Dashboard',
  ANALYTICS: 'Analytics',
  PENDING: 'Pending registrations',
  ALL_USERS: 'All users',
  ROLES_PERMISSIONS: 'Roles & permissions',
  BULK_IMPORT: 'Bulk import',
  RESET_PASSWORD: 'Reset password',
  DEACTIVATE_USER: 'Employee Directory',
  PROGRAMS: 'Programs',
  ORGANIZATIONS: 'Organizations',
  AUDIT_LOG: 'Audit log',
  SUPPORT: 'Support',
  INTEGRATIONS: 'Integrations',
  NOTIFICATIONS: 'Notifications',
} as const;


//in program creation using stay type data

export const STAY_TYPES: StayType[] = [
  {
    id: "residential",
    label: "Residential",
    enabled: false,
    options: [
      { id: "single", label: "Single Occupancy", price: "" },
      { id: "twin", label: "Twin Sharing", price: "" },
    ],
  },
  {
    id: "non-residential",
    label: "Non-Residential",
    enabled: false,
    options: [{ id: "non-res-default", label: "Day Scholar", price: "" }],
  },
];
