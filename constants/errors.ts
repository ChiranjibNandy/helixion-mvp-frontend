// Centralized error messages for user-friendly display

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  UNAUTHORIZED: 'You do not have permission to access this resource.',
  TOKEN_MISSING: 'Authentication required. Please sign in.',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
} as const;

export const NETWORK_ERRORS = {
  CONNECTION_FAILED: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT: 'The request timed out. Please try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

export const VALIDATION_ERRORS = {
  EMAIL_INVALID: 'Please enter a valid email address.',
  EMAIL_REQUIRED: 'Email is required.',
  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  PASSWORDS_MISMATCH: 'Passwords do not match.',
  USERNAME_REQUIRED: 'Username is required.',
  FIELD_REQUIRED: (field: string) => `${ field } is required.`,
} as const;

export const FORM_ERRORS = {
  LOGIN_FAILED: 'Unable to sign in. Please check your credentials and try again.',
  REGISTRATION_FAILED: 'Unable to create account. Please try again.',
  DATA_LOAD_FAILED: 'Unable to load data. Please refresh the page.',
} as const;

// Error codes mapped to user-friendly messages
export const ERROR_MESSAGE_MAP: Record<string, string> = {
  'Invalid credentials': AUTH_ERRORS.INVALID_CREDENTIALS,
  'User not found': AUTH_ERRORS.INVALID_CREDENTIALS,
  'Account locked': AUTH_ERRORS.ACCOUNT_LOCKED,
  'Unauthorized': AUTH_ERRORS.UNAUTHORIZED,
  'Token expired': AUTH_ERRORS.SESSION_EXPIRED,
  'Network Error': NETWORK_ERRORS.CONNECTION_FAILED,
  'timeout': NETWORK_ERRORS.TIMEOUT,
  'ECONNREFUSED': NETWORK_ERRORS.CONNECTION_FAILED,
  '500': NETWORK_ERRORS.SERVER_ERROR,
  '502': NETWORK_ERRORS.SERVER_ERROR,
  '503': NETWORK_ERRORS.SERVER_ERROR,
  '504': NETWORK_ERRORS.SERVER_ERROR,
  'Password must contain at least one letter, one number, and one special character': 'Password must contain at least one letter, one number, and one special character.',
} as const;

// Get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const normalized = error.message.trim(); // ✅ normalize

    const mappedMessage = ERROR_MESSAGE_MAP[normalized];
    if (mappedMessage) return mappedMessage;

    return normalized; // 🔥 fallback to original backend message
  }

  if (typeof error === 'string') {
    const normalized = error.trim(); // ✅ normalize

    const mappedMessage = ERROR_MESSAGE_MAP[normalized];
    if (mappedMessage) return mappedMessage;

    return normalized; // 🔥 fallback to original backend message
  }

  return NETWORK_ERRORS.UNKNOWN_ERROR;
}
