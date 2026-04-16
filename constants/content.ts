// Content constants for UI text and static data

// Sign In page content
export const SIGNIN_CONTENT = {
  STATS: [
    { value: '2.4M', accent: '+', label: 'Active learners' },
    { value: '98', accent: '%', label: 'Completion rate' },
    { value: '500', accent: '+', label: 'Enterprise clients' },
  ] as const,
  LEFT_PANEL: {
    HEADLINE: 'One platform.\nThree workspaces.',
    DESCRIPTION:
      'Training Admins, Corporate Employees, and Reporting Managers — each with a purpose-built dashboard, accessed through one unified login.',
  },
  FORM: {
    TITLE: 'Sign In',
    EMAIL_LABEL: 'Email',
    EMAIL_PLACEHOLDER: 'you@company.com',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: '••••••••',
    FORGOT_PASSWORD: 'Forgot password?',
    SUBMIT_BUTTON: 'Sign In →',
    OR_DIVIDER: 'OR',
    NO_ACCOUNT: "Don't have an account?",
    CREATE_ACCOUNT: 'Create account →',
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
    TAG: 'JOIN HELIXON · GET STARTED FREE',
    HEADLINE: 'Your workspace, ready in seconds.',
      
  },
  FORM: {
    TITLE: 'Create your account',
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
  TAGLINE: 'Enterprise Multi-Role Platform',
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
      PENDING_APPROVAL: 'Pending approval',
      ACTIVE_TODAY: 'Active today',
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
  PENDING: 'Pending',
  ALL_USERS: 'All users',
  ROLES_PERMISSIONS: 'Roles & permissions',
  BULK_IMPORT: 'Bulk import',
  PROGRAMS: 'Programs',
  ORGANIZATIONS: 'Organizations',
  AUDIT_LOG: 'Audit log',
  SUPPORT: 'Support',
  INTEGRATIONS: 'Integrations',
  NOTIFICATIONS: 'Notifications',
} as const;
