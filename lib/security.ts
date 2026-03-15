/**
 * Comprehensive Security & Validation Utilities
 *
 * This module provides secure, validated functions for:
 * - Input sanitization and validation
 * - Secure storage (sessionStorage instead of localStorage)
 * - XSS prevention
 * - CSRF protection
 * - Rate limiting
 * - Secure redirects
 */

// ============================================
// TYPES
// ============================================

export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecial?: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface User {
  id: number | string;
  email: string;
  username: string;
  createdAt: string;
  [key: string]: any;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export interface ValidationRule {
  required?: boolean;
  requiredMessage?: string;
  email?: boolean;
  emailMessage?: string;
  username?: boolean;
  usernameMessage?: string;
  password?: boolean;
  passwordOptions?: PasswordValidationOptions;
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  match?: string;
  matchMessage?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

// ============================================
// LOGGER UTILITY (suppressed in production)
// ============================================

/**
 * Safe logger — only outputs in non-production environments
 */
const logger = {
  error: (...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(...args);
    }
  },
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(...args);
    }
  },
};

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
export const isValidUsername = (username: string): boolean => {
  if (!username || typeof username !== "string") return false;
  // Allow alphanumeric, underscore, hyphen, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username.trim());
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (
  password: string,
  options: PasswordValidationOptions = {},
): PasswordValidationResult => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = false,
  } = options;

  const errors: string[] = [];

  if (!password || typeof password !== "string") {
    return { isValid: false, errors: ["Password is required"] };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";

  return (
    input
      .trim()
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove javascript: protocol
      .replace(/javascript:/gi, "")
      // Remove event handlers
      .replace(/on\w+\s*=/gi, "")
      // Remove data: URIs
      .replace(/data:[^;]*;base64,/gi, "")
      // Remove vbscript: protocol
      .replace(/vbscript:/gi, "")
      // Remove expression() for IE
      .replace(/expression\s*\(/gi, "")
  );
};

/**
 * Sanitizes object values recursively
 * @param {any} obj - Object to sanitize
 * @returns {any} - Sanitized object
 */
export const sanitizeObject = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) {
    return typeof obj === "string" ? sanitizeInput(obj) : obj;
  }

  const sanitized: { [key: string]: any } = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    (sanitized as any)[key] =
      typeof value === "string"
        ? sanitizeInput(value)
        : typeof value === "object"
          ? sanitizeObject(value)
          : value;
  }
  return sanitized;
};

// ============================================
// SECURE STORAGE (Using sessionStorage instead of localStorage)
// ============================================

const STORAGE_PREFIX = "hx_";

/**
 * Secure storage wrapper using sessionStorage.
 * Data is cleared when browser session ends (more secure than localStorage).
 */
export const secureStorage = {
  /**
   * Store item securely
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  set: (key: string, value: any): void => {
    try {
      if (typeof window === "undefined") return;
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
    } catch (error) {
      logger.error("Secure storage set error:", error);
    }
  },

  /**
   * Retrieve item from secure storage
   * @param {string} key - Storage key
   * @returns {*} - Stored value or null
   */
  get: (key: string): any => {
    try {
      if (typeof window === "undefined") return null;
      const item = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      logger.error("Secure storage get error:", error);
      return null;
    }
  },

  /**
   * Remove item from secure storage
   * @param {string} key - Storage key
   */
  remove: (key: string): void => {
    try {
      if (typeof window === "undefined") return;
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      logger.error("Secure storage remove error:", error);
    }
  },

  /**
   * Clear all secure storage items (only items with app prefix)
   */
  clear: (): void => {
    try {
      if (typeof window === "undefined") return;
      Object.keys(sessionStorage)
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .forEach((key) => sessionStorage.removeItem(key));
    } catch (error) {
      logger.error("Secure storage clear error:", error);
    }
  },
};

// ============================================
// AUTHENTICATION UTILITIES
// ============================================

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = (): boolean => {
  const token = secureStorage.get("token");
  const user = secureStorage.get("user");
  return !!(token && user);
};

/**
 * Get current authenticated user
 * @returns {Object|null}
 */
export const getCurrentUser = (): User | null => {
  return secureStorage.get("user");
};

/**
 * Get authentication token
 * @returns {string|null}
 */
export const getToken = (): string | null => {
  return secureStorage.get("token");
};

/**
 * Set authentication data
 * @param {string} token - JWT token
 * @param {Object} user - User data
 */
export const setAuth = (token: string, user: User): void => {
  secureStorage.set("token", token);
  secureStorage.set("user", sanitizeObject(user));
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  secureStorage.remove("token");
  secureStorage.remove("user");
};

/**
 * Logout user and redirect
 * @param {string} redirectPath - Path to redirect after logout
 */
export const logout = (redirectPath = "/"): void => {
  clearAuth();
  if (typeof window !== "undefined") {
    window.location.href = redirectPath;
  }
};

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate CSRF token using crypto API
 * @returns {string} - CSRF token
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for older browsers
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

/**
 * Store CSRF token in secure storage
 * @returns {string} - Generated token
 */
export const storeCSRFToken = (): string => {
  const token = generateCSRFToken();
  secureStorage.set("csrf_token", token);
  return token;
};

/**
 * Get stored CSRF token
 * @returns {string|null}
 */
export const getCSRFToken = (): string | null => {
  return secureStorage.get("csrf_token");
};

// ============================================
// RATE LIMITING
// ============================================

const rateLimitStore = new Map<string, number[]>();

/**
 * Check if action is within rate limit
 * @param {string} action - Action identifier
 * @param {number} maxAttempts - Max attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} - { allowed: boolean, remaining: number, resetTime: number }
 */
export const checkRateLimit = (
  action: string,
  maxAttempts = 5,
  windowMs = 60000,
): RateLimitResult => {
  const now = Date.now();
  const key = action;

  let attempts = rateLimitStore.get(key);

  if (!attempts) {
    attempts = [];
    rateLimitStore.set(key, attempts);
  }

  // Remove old attempts outside the window
  const validAttempts = attempts.filter((time) => now - time < windowMs);
  rateLimitStore.set(key, validAttempts);

  const remaining = Math.max(0, maxAttempts - validAttempts.length);
  const resetTime =
    validAttempts.length > 0 ? validAttempts[0] + windowMs : now + windowMs;

  if (validAttempts.length >= maxAttempts) {
    return { allowed: false, remaining: 0, resetTime };
  }

  // Add current attempt
  validAttempts.push(now);

  return { allowed: true, remaining: remaining - 1, resetTime };
};

/**
 * Reset rate limit for an action
 * @param {string} action - Action identifier
 */
export const resetRateLimit = (action: string): void => {
  rateLimitStore.delete(action);
};

// ============================================
// SECURE REDIRECTS
// ============================================

/**
 * Validates and sanitizes redirect URL to prevent open redirect attacks
 * @param {string} url - URL to validate
 * @param {string} defaultPath - Default path if invalid
 * @returns {string} - Safe redirect path
 */
export const validateRedirect = (url: string, defaultPath = "/"): string => {
  if (!url || typeof url !== "string") {
    return defaultPath;
  }

  // Only allow relative URLs (block absolute/external redirects)
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//")
  ) {
    return defaultPath;
  }

  // Remove any javascript: or data: protocols
  if (/^(javascript|data|vbscript):/i.test(url)) {
    return defaultPath;
  }

  // Ensure path starts with /
  const safePath = url.startsWith("/") ? url : `/${url}`;

  // Remove any null bytes
  const sanitized = safePath.replace(/\0/g, "");

  // Only allow alphanumeric, /, -, _, ?, =, &, common safe chars
  if (!/^[a-zA-Z0-9\/_\-?=&.]+$/.test(sanitized.split("?")[0])) {
    return defaultPath;
  }

  return sanitized;
};

// ============================================
// PASSWORD STRENGTH CALCULATOR
// ============================================

export interface PasswordStrengthInfo {
  score: number;
  label: string;
  color: string;
  width: string;
}

/**
 * Calculate password strength score and visual feedback
 * @param {string} password - Password to check
 * @returns {Object} - Strength info with score, label, color, width
 */
export const calculatePasswordStrength = (
  password: string,
): PasswordStrengthInfo => {
  if (!password) {
    return { score: 0, label: "", color: "transparent", width: "0%" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengthMap: PasswordStrengthInfo[] = [
    { score: 0, label: "", color: "transparent", width: "0%" },
    { score: 1, label: "Weak", color: "#ef4444", width: "25%" },
    { score: 2, label: "Fair", color: "#f59e0b", width: "50%" },
    { score: 3, label: "Good", color: "#3b82f6", width: "75%" },
    { score: 4, label: "Strong", color: "#22c55e", width: "100%" },
  ];

  return strengthMap[score] || strengthMap[0];
};

// ============================================
// FORM VALIDATION HELPERS
// ============================================

/**
 * Validates entire form data against a rules object
 * @param {Object} data - Form data object
 * @param {Object} rules - Validation rules
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateForm = (
  data: { [key: string]: any },
  rules: ValidationRules,
): ValidationResult => {
  const errors: { [key: string]: string } = {};

  for (const [field, value] of Object.entries(data)) {
    const fieldRules = rules[field];
    if (!fieldRules) continue;

    // Required check
    if (fieldRules.required && (!value || value.toString().trim() === "")) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      continue;
    }

    // Skip other validations if empty and not required
    if (!value) continue;

    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = fieldRules.emailMessage || "Invalid email address";
    }

    // Username validation
    if (fieldRules.username && !isValidUsername(value)) {
      errors[field] =
        fieldRules.usernameMessage ||
        "Invalid username (3-20 chars, alphanumeric only)";
    }

    // Password validation
    if (fieldRules.password) {
      const passwordValidation = validatePassword(
        value,
        fieldRules.passwordOptions,
      );
      if (!passwordValidation.isValid) {
        errors[field] = passwordValidation.errors[0];
      }
    }

    // Min length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] =
        fieldRules.minLengthMessage ||
        `Must be at least ${fieldRules.minLength} characters`;
    }

    // Max length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] =
        fieldRules.maxLengthMessage ||
        `Must be less than ${fieldRules.maxLength} characters`;
    }

    // Pattern
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.patternMessage || "Invalid format";
    }

    // Match (for password confirmation)
    if (fieldRules.match && value !== data[fieldRules.match]) {
      errors[field] = fieldRules.matchMessage || "Fields do not match";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// SECURITY HEADERS FOR API CALLS
// ============================================

/**
 * Get secure headers for API requests
 * @returns {Object} - Headers object with CSRF and auth tokens
 */
export const getSecureHeaders = (): { [key: string]: string } => {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  const csrfToken = getCSRFToken();
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const authToken = getToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
};

/**
 * Secure fetch wrapper with rate limiting, CSRF, and sanitization
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch response
 */
export const secureFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  // Check rate limiting
  const rateLimit = checkRateLimit(url, 10, 60000);
  if (!rateLimit.allowed) {
    throw new Error(
      `Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds.`,
    );
  }

  const secureOptions: RequestInit = {
    ...options,
    headers: {
      ...getSecureHeaders(),
      ...(options.headers as any),
    },
    credentials: "same-origin",
  };

  // Ensure body is stringified if it's an object
  if (secureOptions.body && typeof secureOptions.body === "object") {
    secureOptions.body = JSON.stringify(sanitizeObject(secureOptions.body));
  }

  try {
    const response = await fetch(url, secureOptions);

    // Update CSRF token if provided in response
    const newToken = response.headers.get("X-CSRF-Token");
    if (newToken) {
      secureStorage.set("csrf_token", newToken);
    }

    return response;
  } catch (error) {
    logger.error("Secure fetch error:", error);
    throw error;
  }
};

// ============================================
// MOCK AUTHENTICATION (for frontend-only demo)
// ============================================

// In-memory user store for demo purposes
const mockUsers = new Map<string, User>();

/**
 * Mock login function (for demo without backend)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Login result with user and token
 */
export const mockLogin = async (
  email: string,
  password: string,
): Promise<AuthData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validate inputs
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // For demo: accept any valid email with any password.
  // In production, this would validate against a real database.
  const user: User = mockUsers.get(email) || {
    id: Date.now(),
    email: sanitizeInput(email),
    username: sanitizeInput(email.split("@")[0]),
    createdAt: new Date().toISOString(),
  };

  // Generate mock token (base64-encoded payload — NOT a real JWT)
  const token = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }),
  );

  // Store auth data
  setAuth(token, user);

  // Reset rate limit on successful login
  resetRateLimit("login");

  return { user, token };
};

/**
 * Mock register function (for demo without backend)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registration result with user and token
 */
export const mockRegister = async (userData: any): Promise<AuthData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Sanitize all inputs
  const sanitized = sanitizeObject(userData);
  const { username, email, password } = sanitized;

  // Validate username
  if (!isValidUsername(username)) {
    throw new Error(
      "Username must be 3-20 characters (alphanumeric, underscore, hyphen only)",
    );
  }

  // Validate email
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  // Validate password strength
  const passwordValidation = validatePassword(password, {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
  });

  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors[0]);
  }

  // Check if email already registered
  if (mockUsers.has(email)) {
    throw new Error("An account with this email already exists");
  }

  // Create user record
  const user: User = {
    id: Date.now(),
    username,
    email,
    createdAt: new Date().toISOString(),
  };

  mockUsers.set(email, user);

  // Generate mock token (base64-encoded payload — NOT a real JWT)
  const token = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    }),
  );

  setAuth(token, user);

  return { user, token };
};

// Export all utilities as named exports (above) and default export
const SecurityUtils = {
  // Validation
  isValidEmail,
  isValidUsername,
  validatePassword,
  validateForm,
  calculatePasswordStrength,

  // Sanitization
  sanitizeInput,
  sanitizeObject,

  // Storage
  secureStorage,

  // Auth
  isAuthenticated,
  getCurrentUser,
  getToken,
  setAuth,
  clearAuth,
  logout,

  // CSRF
  generateCSRFToken,
  storeCSRFToken,
  getCSRFToken,

  // Rate Limiting
  checkRateLimit,
  resetRateLimit,

  // Redirects
  validateRedirect,

  // API
  getSecureHeaders,
  secureFetch,

  // Mock Auth
  mockLogin,
  mockRegister,
};

export default SecurityUtils;
