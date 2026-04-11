// Constants for admin dashboard

export const API_ENDPOINTS = {
  REGISTRATIONS: '/admin/registrations',
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
  DAYS_AGO: (days: number) => `${days} days ago`,
} as const;

export const MODAL_CONTENT = {
  APPROVE_USER: {
    TITLE: 'Approve User',
    SUCCESS_MESSAGE: 'User Approved!',
    CONFIRM_LABEL: 'Confirm & Approve',
    CANCEL_LABEL: 'Cancel',
    SUBTITLE: 'Select the appropriate role for this user.',
    LOADING_LABEL: 'Approving...',
  },
} as const;
