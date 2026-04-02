// Constants for admin dashboard

export const API_ENDPOINTS = {
  REGISTRATIONS: '/admin/registrations',
} as const;

export const ACTIVITY_DOT_COLORS = {
  success: 'bg-[#16a34a]',
  error: 'bg-[#dc2626]',
  warning: 'bg-[#f59e0b]',
  info: 'bg-primary',
} as const;

export const COLOR_CLASSES = {
  TEXT_MUTED: 'text-[#6b7280]',
  TEXT_SECONDARY: 'text-[#d1d5db]',
  TEXT_BLUE: 'text-blue-400',
  TEXT_WARNING: 'text-[#f59e0b]',
  BG_MAIN: 'bg-bgMain',
  BG_CARD: 'bg-[#0f1629]',
  BG_DARK: 'bg-[#0a0f1e]',
  BORDER: 'border-[#1a2235]',
  PRIMARY: 'primary',
} as const;

export const UI_MESSAGES = {
  LOADING_REGISTRATIONS: 'Loading registrations...',
  NO_RECENT_ACTIVITY: 'No recent activity',
  DATA_UNAVAILABLE: 'Data unavailable',
  NEEDS_ACTION: 'Needs action',
  ALL_TIME: 'All time',
  COMING_SOON: 'Coming soon',
} as const;

export const ICON_EMOJIS = ['👤', '👨', '👩', '🧑'] as const;
export const ICON_BACKGROUNDS = ['bg-[#1e3a8a]', 'bg-[#166534]', 'bg-[#7c2d12]', 'bg-[#713f12]'] as const;

export const DATE_FORMATS = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  DAYS_AGO: (days: number) => `${days} days ago`,
} as const;
