'use client';

import React, { useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import {
  IconUser,
  IconMail,
  IconKey,
  IconEye,
  IconEyeOff,
  IconArrowRight
} from '@/components/ui/Icons';
import {
  sanitizeInput,
  isValidEmail,
  isValidUsername,
  validatePassword,
  calculatePasswordStrength,
  checkRateLimit,
  mockRegister,
  validateRedirect,
  PasswordStrengthInfo,
} from '@/lib/security';
import { COLORS } from '@/lib/constants';
import { useTranslations } from 'next-intl';



export interface RegisterFormProps {
  redirectPath?: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agree?: string;
}


const logger = {
  error: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  },
};

/**
 * Validation rules for registration form
 */
const VALIDATION_RULES = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    requiredMessage: 'Username is required',
    minLengthMessage: 'Username must be at least 3 characters',
    maxLengthMessage: 'Username must be less than 20 characters',
  },
  email: {
    required: true,
    email: true,
    requiredMessage: 'Email is required',
    emailMessage: 'Please enter a valid email address',
  },
  password: {
    required: true,
    minLength: 8,
    requiredMessage: 'Password is required',
    minLengthMessage: 'Password must be at least 8 characters',
  },
  confirmPassword: {
    required: true,
    match: 'password' as const,
    requiredMessage: 'Please confirm your password',
    matchMessage: 'Passwords do not match',
  },
  terms: {
    required: true,
    requiredMessage: 'Please accept the terms to continue',
  },
};

/**
 * RegisterForm Component - Main export
 */
export default function RegisterForm({ redirectPath = '/' }: RegisterFormProps) {
  const t = useTranslations('auth');
  // State management with consolidated form data

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Calculate password strength reactively
  const strength: PasswordStrengthInfo = calculatePasswordStrength(formData.password);

  /**
   * Handle input changes with sanitization
   */
  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'agree' ? value : sanitizeInput(value as string),
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear general error
    if (generalError) {
      setGeneralError('');
    }
  }, [errors, generalError]);

  /**
   * Validate all form fields
   */
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = VALIDATION_RULES.username.requiredMessage;
    } else if (formData.username.length < VALIDATION_RULES.username.minLength) {
      newErrors.username = VALIDATION_RULES.username.minLengthMessage;
    } else if (formData.username.length > VALIDATION_RULES.username.maxLength) {
      newErrors.username = VALIDATION_RULES.username.maxLengthMessage;
    } else if (!isValidUsername(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_RULES.email.requiredMessage;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = VALIDATION_RULES.email.emailMessage;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = VALIDATION_RULES.password.requiredMessage;
    } else {
      const passwordValidation = validatePassword(formData.password, {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
      });

      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_RULES.confirmPassword.requiredMessage;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = VALIDATION_RULES.confirmPassword.matchMessage;
    }

    // Terms validation
    if (!formData.agree) {
      newErrors.agree = VALIDATION_RULES.terms.requiredMessage;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setGeneralError('');
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check rate limiting — 3 attempts per 10 minutes for registration
    const rateLimit = checkRateLimit('register', 3, 600000);
    if (!rateLimit.allowed) {
      setGeneralError(
        `Too many registration attempts. Please try again in ${Math.ceil(
          (rateLimit.resetTime - Date.now()) / 1000 / 60
        )} minutes.`
      );
      return;
    }

    setIsLoading(true);

    try {
      // Attempt registration using mock authentication
      await mockRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setIsSuccess(true);
    } catch (error: any) {
      logger.error('Registration error:', error);
      setGeneralError(
        error.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // SUCCESS STATE
  // ============================================
  if (isSuccess) {
    return (
      <div className="text-center py-6 hx-fade-up" role="alert" aria-live="polite">
        <div
          className="mx-auto mb-5 flex items-center justify-center rounded-2xl"
          style={{
            width: 64,
            height: 64,
            background: COLORS.background.success,
            border: `1px solid ${COLORS.semantic.successBorder}`,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.text.success}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{
          fontSize: 20,
          fontWeight: 800,
          color: COLORS.text.primary,
          marginBottom: 8,
        }}>
          {t('accountCreated')}
        </h3>

        <p style={{
          fontSize: 14,
          color: COLORS.text.muted,
          marginBottom: 28,
          lineHeight: 1.6,
        }}>
          {t('welcomeMessage')}{' '}
          <strong style={{ color: COLORS.text.secondary }}>{formData.username}</strong>.
          <br />You can now sign in to your workspace.
        </p>

        <Link
          href={validateRedirect(redirectPath, '/')}
          className="submit-btn inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-3.5 hover:opacity-90 transition-opacity"
          style={{
            background: COLORS.gradient.primary,
            color: COLORS.text.white,
            fontSize: 14.5,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: COLORS.shadow?.lg || '0 4px 20px rgba(42,92,232,0.45)',
          }}
        >
          <IconArrowRight size={15} color={COLORS.text.white} />
          {t('goToSignIn')}
        </Link>

      </div>
    );
  }

  // ============================================
  // FORM STATE
  // ============================================
  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
      {/* General Error Message */}
      {generalError && (
        <div
          className="rounded-lg px-3.5 py-2.5 mb-4 text-sm"
          style={{
            background: COLORS.background.error,
            border: `1px solid ${COLORS.semantic.errorBorder}`,
            color: COLORS.text.error,
          }}
          role="alert"
          aria-live="assertive"
        >
          {generalError}
        </div>
      )}

      {/* Username Field */}
      <div className="mb-3.5">
        <label
          htmlFor="register-username"
          className="block mb-1.5"
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: COLORS.text.muted,
            textTransform: 'uppercase',
          }}
        >
          {t('usernameLabel')}
        </label>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconUser size={15} color={COLORS.text.placeholder} />
          </span>
          <input
            type="text"
            id="register-username"
            name="username"
            className="hx-input w-full rounded-xl pl-10 pr-4 py-3.5"
            placeholder={t('usernamePlaceholder')}
            value={formData.username}

            onChange={(e) => handleInputChange('username', e.target.value)}
            autoComplete="username"
            aria-required="true"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'register-username-error' : undefined}
            style={{
              background: COLORS.background.input,
              border: `1px solid ${errors.username ? COLORS.border.error : COLORS.border.primary}`,
              color: COLORS.text.primary,
              fontFamily: 'inherit',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        {errors.username && (
          <p
            id="register-username-error"
            role="alert"
            style={{ fontSize: 12, color: COLORS.text.error, marginTop: 4 }}
          >
            {errors.username}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-3.5">
        <label
          htmlFor="register-email"
          className="block mb-1.5"
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: COLORS.text.muted,
            textTransform: 'uppercase',
          }}
        >
          {t('workEmailLabel')}
        </label>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconMail size={15} color={COLORS.text.placeholder} />
          </span>
          <input
            type="email"
            id="register-email"
            name="email"
            className="hx-input w-full rounded-xl pl-10 pr-4 py-3.5"
            placeholder={t('emailPlaceholder')}
            value={formData.email}

            onChange={(e) => handleInputChange('email', e.target.value)}
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            style={{
              background: COLORS.background.input,
              border: `1px solid ${errors.email ? COLORS.border.error : COLORS.border.primary}`,
              color: COLORS.text.primary,
              fontFamily: 'inherit',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        {errors.email && (
          <p
            id="register-email-error"
            role="alert"
            style={{ fontSize: 12, color: COLORS.text.error, marginTop: 4 }}
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-3.5">
        <label
          htmlFor="register-password"
          className="block mb-1.5"
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: COLORS.text.muted,
            textTransform: 'uppercase',
          }}
        >
          {t('passwordLabel')}
        </label>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconKey size={15} color={COLORS.text.placeholder} />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            name="password"
            className="hx-input w-full rounded-xl pl-10 pr-11 py-3.5"
            placeholder={t('passwordMinLength')}
            value={formData.password}

            onChange={(e) => handleInputChange('password', e.target.value)}
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={[
              errors.password ? 'register-password-error' : '',
              'register-password-strength',
            ].filter(Boolean).join(' ') || undefined}
            style={{
              background: COLORS.background.input,
              border: `1px solid ${errors.password ? COLORS.border.error : COLORS.border.primary}`,
              color: COLORS.text.primary,
              fontFamily: 'inherit',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pw-toggle absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.text.placeholder,
              padding: 2,
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword
              ? <IconEyeOff size={15} color={COLORS.text.placeholder} />
              : <IconEye size={15} color={COLORS.text.placeholder} />
            }
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2" id="register-password-strength" aria-live="polite">
            <div
              className="rounded-full mb-1"
              style={{
                height: 3,
                background: COLORS.background.tertiary,
                overflow: 'hidden',
              }}
            >
              <div
                className="strength-bar"
                style={{
                  width: strength.width,
                  background: strength.color,
                  height: '100%',
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                }}
              />
            </div>
            <span style={{
              fontSize: 11,
              color: strength.color,
              fontWeight: 600,
            }}>
              {strength.label}
            </span>
          </div>
        )}

        {errors.password && (
          <p
            id="register-password-error"
            role="alert"
            style={{ fontSize: 12, color: COLORS.text.error, marginTop: 4 }}
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="mb-3.5">
        <label
          htmlFor="register-confirm-password"
          className="block mb-1.5"
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: COLORS.text.muted,
            textTransform: 'uppercase',
          }}
        >
          {t('confirmPasswordLabel')}
        </label>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconKey size={15} color={COLORS.text.placeholder} />
          </span>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="register-confirm-password"
            name="confirmPassword"
            className="hx-input w-full rounded-xl pl-10 pr-11 py-3.5"
            placeholder={t('confirmPasswordPlaceholder')}
            value={formData.confirmPassword}

            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={
              !!errors.confirmPassword ||
              !!(formData.confirmPassword && formData.confirmPassword !== formData.password)
            }
            aria-describedby={
              errors.confirmPassword || (formData.confirmPassword && formData.confirmPassword !== formData.password)
                ? 'register-confirm-password-error'
                : undefined
            }
            style={{
              background: COLORS.background.input,
              border: `1px solid ${
                errors.confirmPassword ||
                (formData.confirmPassword && formData.confirmPassword !== formData.password)
                  ? COLORS.border.error
                  : COLORS.border.primary
              }`,
              color: COLORS.text.primary,
              fontFamily: 'inherit',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="pw-toggle absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.text.placeholder,
              padding: 2,
            }}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword
              ? <IconEyeOff size={15} color={COLORS.text.placeholder} />
              : <IconEye size={15} color={COLORS.text.placeholder} />
            }
          </button>
        </div>

        {/* FIX: Single error message — inline mismatch OR submit-time error, not both */}
        {(errors.confirmPassword || (formData.confirmPassword && formData.confirmPassword !== formData.password)) && (
          <p
            id="register-confirm-password-error"
            role="alert"
            style={{ fontSize: 12, color: COLORS.text.error, marginTop: 4 }}
          >
            {errors.confirmPassword || t('passwordMismatch')}
          </p>

        )}
      </div>

      {/* Terms Checkbox */}
      <div className="mb-4 flex items-start gap-2.5">
        <input
          type="checkbox"
          id="register-terms"
          name="terms"
          checked={formData.agree}
          onChange={(e) => handleInputChange('agree', e.target.checked)}
          className="mt-0.5 cursor-pointer"
          style={{ accentColor: COLORS.primary[600] }}
          aria-required="true"
          aria-invalid={!!errors.agree}
          aria-describedby={errors.agree ? 'register-terms-error' : undefined}
        />
        <label
          htmlFor="register-terms"
          className="cursor-pointer"
          style={{
            fontSize: 13,
            color: COLORS.text.muted,
            lineHeight: 1.5,
          }}
        >
          I agree to the{' '}
          <Link
            href="/terms"
            style={{ color: COLORS.primary[500], textDecoration: 'none' }}
            className="hover:opacity-80 transition-opacity"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            style={{ color: COLORS.primary[500], textDecoration: 'none' }}
            className="hover:opacity-80 transition-opacity"
          >
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.agree && (
        <p
          id="register-terms-error"
          role="alert"
          style={{ fontSize: 12, color: COLORS.text.error, marginTop: -8, marginBottom: 12 }}
        >
          {errors.agree}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="submit-btn w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5"
        style={{
          background: isLoading
            ? 'rgba(42,92,232,0.55)'
            : COLORS.gradient.primary,
          border: 'none',
          color: COLORS.text.white,
          fontSize: 14.5,
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: isLoading ? 'none' : COLORS.shadow?.lg || '0 4px 20px rgba(42,92,232,0.45)',
          letterSpacing: '0.01em',
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        {isLoading ? (
          <span className="hx-spinner" />
        ) : (
          <>
            <IconArrowRight size={15} color={COLORS.text.white} />
            <span>{t('createAccountBtn')}</span>
          </>
        )}

      </button>

      {/* Sign In Link */}
      <p className="text-center mt-5" style={{
        fontSize: 13.5,
        color: COLORS.text.tertiary,
      }}>
        {t('alreadyHaveAccount')}{' '}

        <Link
          href="/"
          style={{
            color: COLORS.primary[500],
            fontWeight: 700,
            textDecoration: 'none',
          }}
          className="register-link hover:opacity-80 transition-opacity"
        >
          {t('signInLink')}
        </Link>

      </p>
    </form>
  );
}

// Export validation rules for testing
export { VALIDATION_RULES };