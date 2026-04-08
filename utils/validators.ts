// Form validation utilities
// Pure functions for validating form inputs

import { VALIDATION_ERRORS } from '@/constants/errors';
import { EMAIL_REGEX, PASSWORD_RULES, USERNAME_RULES } from '@/constants/validation';

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Field validators
export const validators = {
  /**
   * Validate email address
   */
  email: (value: string): string | undefined => {
    if (!value.trim()) {
      return VALIDATION_ERRORS.EMAIL_REQUIRED;
    }
    if (!EMAIL_REGEX.test(value)) {
      return VALIDATION_ERRORS.EMAIL_INVALID;
    }
    return undefined;
  },

  /**
   * Validate password
   */
  password: (value: string): string | undefined => {
    if (!value) {
      return VALIDATION_ERRORS.PASSWORD_REQUIRED;
    }
    if (value.length < PASSWORD_RULES.MIN_LENGTH) {
      return VALIDATION_ERRORS.PASSWORD_TOO_SHORT;
    }
    return undefined;
  },

  /**
   * Validate username
   */
  username: (value: string): string | undefined => {
    if (!value.trim()) {
      return VALIDATION_ERRORS.USERNAME_REQUIRED;
    }
    if (value.length < USERNAME_RULES.MIN_LENGTH) {
      return `Username must be at least ${USERNAME_RULES.MIN_LENGTH} characters.`;
    }
    if (value.length > USERNAME_RULES.MAX_LENGTH) {
      return `Username must be no more than ${USERNAME_RULES.MAX_LENGTH} characters.`;
    }
    if (!USERNAME_RULES.ALLOWED_CHARS.test(value)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens.';
    }
    return undefined;
  },

  /**
   * Validate password confirmation
   */
  confirmPassword: (value: string, password: string): string | undefined => {
    if (!value) {
      return 'Please confirm your password.';
    }
    if (value !== password) {
      return VALIDATION_ERRORS.PASSWORDS_MISMATCH;
    }
    return undefined;
  },
};

// Form-specific validation functions
export const validateLoginForm = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailError = validators.email(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validators.password(data.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  const usernameError = validators.username(data.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validators.email(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validators.password(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validators.confirmPassword(data.confirmPassword, data.password);
  if (confirmError) errors.confirm = confirmError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
