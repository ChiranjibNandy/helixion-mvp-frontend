import { DATE_FORMATS } from '@/constants/admin';
import { UserRegistration, FormattedRegistration } from '@/types/admin';

/**
 * Formats date string to human readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return DATE_FORMATS.TODAY;
  if (diffDays === 1) return DATE_FORMATS.YESTERDAY;
  if (diffDays < 7) return DATE_FORMATS.DAYS_AGO(diffDays);

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Transforms API registration data to UI format
 */
export const transformRegistrationData = (
  registrations: unknown[]
): FormattedRegistration[] => {
  return registrations.map((item) => {
    const registration = item as UserRegistration;
    return {
      id: registration.id,
      name: registration.username,
      email: registration.email,
      date: formatDate(registration.createdAt),
    };
  });
};

/**
 * Generates icon and background for registration rows
 */
export const getRegistrationIcon = (index: number) => {
  const { ICON_EMOJIS, ICON_BACKGROUNDS } = require('@/constants/admin');
  
  return {
    icon: ICON_EMOJIS[index % ICON_EMOJIS.length],
    iconBg: ICON_BACKGROUNDS[index % ICON_BACKGROUNDS.length],
  };
};

/**
 * Validates API response structure
 */
export const isValidApiResponse = <T>(
  response: unknown
): response is { success: boolean; data: T } => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'data' in response
  );
};
