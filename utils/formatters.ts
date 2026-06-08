/**
 * Formats an ISO date string to YYYY-MM-DD.
 * Returns '—' if the value is falsy.
 */
export const formatDate = (d?: string): string =>
  d ? new Date(d).toISOString().split('T')[0] : '—';

/**
 * Formats an ISO date string to "12 Apr 2025".
 */
export const formatShortDate = (d?: string): string =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    : '—';

/**
 * Formats an ISO date string to "11:30 PM".
 */
export const formatTime = (d?: string): string =>
  d
    ? new Date(d).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    : '—';

/**
 * Formats an ISO date string to a human-readable "last updated" timestamp.
 * Example: "May 16, 2026, 11:30 PM"
 */
export const formatUpdatedAt = (d: string): string =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * Generates a short draft ID from a full MongoDB ObjectId.
 * Example: "682abc1f" → "DR-BC1F"
 */
export const shortDraftId = (id: string): string =>
  `DR-${id.slice(-4).toUpperCase()}`;

/**
 * Masks a password string with bullet characters for preview display.
 */
export const maskPassword = (value?: string, maxLength = 12): string =>
  '•'.repeat(Math.min(value?.length || 0, maxLength));

export const toDisplayDate = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
};

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = end.toLocaleString('en-US', { month: 'short' });

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${startDay}–${endDay} ${month}`;
  }

  const startMonth = start.toLocaleString('en-US', { month: 'short' });
  return `${startDay} ${startMonth} – ${endDay} ${month}`;
}
