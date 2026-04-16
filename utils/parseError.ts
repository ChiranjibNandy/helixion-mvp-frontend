import { getErrorMessage, FORM_ERRORS } from '@/constants/errors';

interface ParsedError {
  message: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Parse API error into user-friendly format
 * Never exposes raw error details to UI
 */
export function parseApiError(error: unknown): ParsedError {
  // Handle axios-style errors
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: unknown } };
    const res = axiosError.response?.data;

    if (res && typeof res === 'object') {
      // Case 1: validation errors with errors array (e.g., { message: "Validation failed", errors: ["..."] })
      if ('errors' in res && Array.isArray(res.errors) && res.errors.length > 0) {
        const firstError = res.errors[0];
        if (typeof firstError === 'string') {
          return { message: getErrorMessage(firstError) };
        }
      }

      // Case 2: validation errors with field-level details (nested properties)
      if ('errors' in res && res.errors && typeof res.errors === 'object') {
        const errors = res.errors as Record<string, unknown>;
        
        if ('properties' in errors && errors.properties && typeof errors.properties === 'object') {
          const fieldErrors: Record<string, string> = {};
          const props = errors.properties as Record<string, { errors?: string[] }>;

          for (const key in props) {
            if (props[key]?.errors?.length) {
              fieldErrors[key] = props[key].errors![0];
            }
          }

          return {
            message: 'Please correct the errors below.',
            fieldErrors,
          };
        }
      }

      // Case 3: simple message error
      if ('message' in res && typeof res.message === 'string') {
        return { message: getErrorMessage(res.message) };
      }
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return { message: getErrorMessage(error.message) };
  }

  // Fallback for unknown error types
  return { message: FORM_ERRORS.LOGIN_FAILED };
}