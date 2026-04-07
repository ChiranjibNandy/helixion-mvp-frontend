// Validation patterns and rules

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: false,
  REQUIRE_LOWERCASE: false,
  REQUIRE_NUMBER: false,
  REQUIRE_SPECIAL: false,
} as const;

// Username requirements
export const USERNAME_RULES = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 32,
  ALLOWED_CHARS: /^[a-zA-Z0-9_-]+$/,
} as const;

// Form field names
export const FIELD_NAMES = {
  USERNAME: 'username',
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
} as const;

// Auto-complete values
export const AUTOCOMPLETE = {
  EMAIL: 'email',
  USERNAME: 'username',
  CURRENT_PASSWORD: 'current-password',
  NEW_PASSWORD: 'new-password',
} as const;
