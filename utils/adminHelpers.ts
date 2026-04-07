import { DATE_FORMATS, AVATAR_BACKGROUNDS } from '@/constants/admin';
import { UserRegistration, FormattedRegistration } from '@/types/admin';

/**
 * Type guard to check if an item is a valid UserRegistration
 */
function isUserRegistration(item: unknown): item is UserRegistration {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const reg = item as Record<string, unknown>;

  return (
    typeof reg.id === 'string' &&
    typeof reg.username === 'string' &&
    typeof reg.email === 'string' &&
    typeof reg.createdAt === 'string'
  );
}

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
 * Uses type guards for safe data validation
 */
export const transformRegistrationData = (
  registrations: unknown[]
): FormattedRegistration[] => {
  return registrations
    .filter(isUserRegistration)
    .map((registration) => ({
      id: registration.id,
      name: registration.username,
      email: registration.email,
      date: formatDate(registration.createdAt),
    }));
};

/**
 * Gets avatar background class based on index
 */
export const getAvatarBackground = (index: number): string => {
  return AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length];
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
