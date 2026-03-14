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
// INPUT VALIDATION
// ============================================

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
export const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
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
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = false,
  } = options;

  const errors = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
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
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data: URIs
    .replace(/data:[^;]*;base64,/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove expression() for IE
    .replace(/expression\s*\(/gi, '');
};

/**
 * Sanitizes object values recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeInput(obj) : obj;
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = typeof value === 'string' 
      ? sanitizeInput(value) 
      : typeof value === 'object' 
        ? sanitizeObject(value)
        : value;
  }
  return sanitized;
};

// ============================================
// SECURE STORAGE (Using sessionStorage instead of localStorage)
// ============================================

const STORAGE_PREFIX = 'hx_';

/**
 * Secure storage wrapper using sessionStorage
 * Data is cleared when browser session ends (more secure than localStorage)
 */
export const secureStorage = {
  /**
   * Store item securely
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  set: (key, value) => {
    try {
      if (typeof window === 'undefined') return;
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  },

  /**
   * Retrieve item from secure storage
   * @param {string} key - Storage key
   * @returns {*} - Stored value or null
   */
  get: (key) => {
    try {
      if (typeof window === 'undefined') return null;
      const item = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  },

  /**
   * Remove item from secure storage
   * @param {string} key - Storage key
   */
  remove: (key) => {
    try {
      if (typeof window === 'undefined') return;
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error('Secure storage remove error:', error);
    }
  },

  /**
   * Clear all secure storage
   */
  clear: () => {
    try {
      if (typeof window === 'undefined') return;
      // Only clear items with our prefix
      Object.keys(sessionStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('Secure storage clear error:', error);
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
export const isAuthenticated = () => {
  const token = secureStorage.get('token');
  const user = secureStorage.get('user');
  return !!(token && user);
};

/**
 * Get current authenticated user
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  return secureStorage.get('user');
};

/**
 * Get authentication token
 * @returns {string|null}
 */
export const getToken = () => {
  return secureStorage.get('token');
};

/**
 * Set authentication data
 * @param {string} token - JWT token
 * @param {Object} user - User data
 */
export const setAuth = (token, user) => {
  secureStorage.set('token', token);
  secureStorage.set('user', sanitizeObject(user));
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  secureStorage.remove('token');
  secureStorage.remove('user');
};

/**
 * Logout user and redirect
 * @param {string} redirectPath - Path to redirect after logout
 */
export const logout = (redirectPath = '/') => {
  clearAuth();
  if (typeof window !== 'undefined') {
    window.location.href = redirectPath;
  }
};

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate CSRF token
 * @returns {string} - CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for older browsers
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Store CSRF token
 */
export const storeCSRFToken = () => {
  const token = generateCSRFToken();
  secureStorage.set('csrf_token', token);
  return token;
};

/**
 * Get stored CSRF token
 * @returns {string|null}
 */
export const getCSRFToken = () => {
  return secureStorage.get('csrf_token');
};

// ============================================
// RATE LIMITING
// ============================================

const rateLimitStore = new Map();

/**
 * Check if action is within rate limit
 * @param {string} action - Action identifier
 * @param {number} maxAttempts - Max attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} - { allowed: boolean, remaining: number, resetTime: number }
 */
export const checkRateLimit = (action, maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  const key = action;
  
  let attempts = rateLimitStore.get(key);
  
  if (!attempts) {
    attempts = [];
    rateLimitStore.set(key, attempts);
  }
  
  // Remove old attempts outside the window
  const validAttempts = attempts.filter(time => now - time < windowMs);
  rateLimitStore.set(key, validAttempts);
  
  const remaining = Math.max(0, maxAttempts - validAttempts.length);
  const resetTime = validAttempts.length > 0 
    ? validAttempts[0] + windowMs 
    : now + windowMs;
  
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
export const resetRateLimit = (action) => {
  rateLimitStore.delete(action);
};

// ============================================
// SECURE REDIRECTS
// ============================================

/**
 * Validates and sanitizes redirect URL
 * @param {string} url - URL to validate
 * @param {string} defaultPath - Default path if invalid
 * @returns {string} - Safe redirect path
 */
export const validateRedirect = (url, defaultPath = '/') => {
  if (!url || typeof url !== 'string') {
    return defaultPath;
  }
  
  // Only allow relative URLs
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return defaultPath;
  }
  
  // Remove any javascript: or data: protocols
  if (/^(javascript|data|vbscript):/i.test(url)) {
    return defaultPath;
  }
  
  // Ensure path starts with /
  const safePath = url.startsWith('/') ? url : `/${url}`;
  
  // Remove any null bytes
  const sanitized = safePath.replace(/\0/g, '');
  
  // Only allow alphanumeric, /, -, _, ?, =, &, common safe chars
  if (!/^[a-zA-Z0-9\/_\-?=&.]+$/.test(sanitized.split('?')[0])) {
    return defaultPath;
  }
  
  return sanitized;
};

// ============================================
// PASSWORD STRENGTH CALCULATOR
// ============================================

/**
 * Calculate password strength
 * @param {string} password - Password to check
 * @returns {Object} - Strength info with score, label, color, width
 */
export const calculatePasswordStrength = (password) => {
  if (!password) {
    return { score: 0, label: '', color: 'transparent', width: '0%' };
  }
  
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const strengthMap = [
    { label: '', color: 'transparent', width: '0%' },
    { label: 'Weak', color: '#ef4444', width: '25%' },
    { label: 'Fair', color: '#f59e0b', width: '50%' },
    { label: 'Good', color: '#3b82f6', width: '75%' },
    { label: 'Strong', color: '#22c55e', width: '100%' },
  ];
  
  return strengthMap[score] || strengthMap[0];
};

// ============================================
// FORM VALIDATION HELPERS
// ============================================

/**
 * Validates entire form data
 * @param {Object} data - Form data object
 * @param {Object} rules - Validation rules
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, value] of Object.entries(data)) {
    const fieldRules = rules[field];
    if (!fieldRules) continue;
    
    // Required check
    if (fieldRules.required && (!value || value.toString().trim() === '')) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      continue;
    }
    
    // Skip other validations if empty and not required
    if (!value) continue;
    
    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = fieldRules.emailMessage || 'Invalid email address';
    }
    
    // Username validation
    if (fieldRules.username && !isValidUsername(value)) {
      errors[field] = fieldRules.usernameMessage || 'Invalid username (3-20 chars, alphanumeric only)';
    }
    
    // Password validation
    if (fieldRules.password) {
      const passwordValidation = validatePassword(value, fieldRules.passwordOptions);
      if (!passwordValidation.isValid) {
        errors[field] = passwordValidation.errors[0];
      }
    }
    
    // Min length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.minLengthMessage || `Must be at least ${fieldRules.minLength} characters`;
    }
    
    // Max length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.maxLengthMessage || `Must be less than ${fieldRules.maxLength} characters`;
    }
    
    // Pattern
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.patternMessage || 'Invalid format';
    }
    
    // Match (for password confirmation)
    if (fieldRules.match && value !== data[fieldRules.match]) {
      errors[field] = fieldRules.matchMessage || 'Fields do not match';
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
 * @returns {Object} - Headers object
 */
export const getSecureHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  const authToken = getToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

/**
 * Secure fetch wrapper
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch response
 */
export const secureFetch = async (url, options = {}) => {
  // Check rate limiting
  const rateLimit = checkRateLimit(url, 10, 60000);
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds.`);
  }
  
  const secureOptions = {
    ...options,
    headers: {
      ...getSecureHeaders(),
      ...options.headers,
    },
    credentials: 'same-origin',
  };
  
  // Ensure body is stringified if it's an object
  if (secureOptions.body && typeof secureOptions.body === 'object') {
    secureOptions.body = JSON.stringify(sanitizeObject(secureOptions.body));
  }
  
  try {
    const response = await fetch(url, secureOptions);
    
    // Update CSRF token if provided in response
    const newToken = response.headers.get('X-CSRF-Token');
    if (newToken) {
      secureStorage.set('csrf_token', newToken);
    }
    
    return response;
  } catch (error) {
    console.error('Secure fetch error:', error);
    throw error;
  }
};

// ============================================
// MOCK AUTHENTICATION (for frontend-only demo)
// ============================================

// In-memory user store for demo purposes
const mockUsers = new Map();

/**
 * Mock login function (for demo without backend)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Login result
 */
export const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check rate limiting
  const rateLimit = checkRateLimit('login', 5, 300000); // 5 attempts per 5 minutes
  if (!rateLimit.allowed) {
    throw new Error('Too many login attempts. Please try again later.');
  }
  
  // Validate inputs
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // For demo: accept any valid email with any password
  // In production, this would validate against a database
  const user = mockUsers.get(email) || {
    id: Date.now(),
    email: sanitizeInput(email),
    username: sanitizeInput(email.split('@')[0]),
    createdAt: new Date().toISOString(),
  };
  
  // Generate mock token
  const token = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }));
  
  // Store auth data
  setAuth(token, user);
  
  // Reset rate limit on success
  resetRateLimit('login');
  
  return { user, token };
};

/**
 * Mock register function (for demo without backend)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registration result
 */
export const mockRegister = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Sanitize inputs
  const sanitized = sanitizeObject(userData);
  const { username, email, password } = sanitized;
  
  // Validate
  if (!isValidUsername(username)) {
    throw new Error('Username must be 3-20 characters (alphanumeric, underscore, hyphen only)');
  }
  
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  const passwordValidation = validatePassword(password, {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
  });
  
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors[0]);
  }
  
  // Check if user exists
  if (mockUsers.has(email)) {
    throw new Error('An account with this email already exists');
  }
  
  // Create user
  const user = {
    id: Date.now(),
    username,
    email,
    createdAt: new Date().toISOString(),
  };
  
  mockUsers.set(email, user);
  
  // Generate token
  const token = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  }));
  
  setAuth(token, user);
  
  return { user, token };
};

// Export all utilities
export default {
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
