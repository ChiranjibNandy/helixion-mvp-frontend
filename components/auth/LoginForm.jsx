"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  IconMail,
  IconKey,
  IconArrowRight,
  IconEye,
  IconEyeOff,
} from "@/components/ui/Icons";
import { COLORS } from "@/lib/constants";
import {
  sanitizeInput,
  isValidEmail,
  checkRateLimit,
  mockLogin,
  validateRedirect,
} from "@/lib/security";

// ============================================
// LOGGER UTILITY (suppressed in production)
// ============================================
const logger = {
  error: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.error(...args);
    }
  },
};

/**
 * Validation rules for login form
 */
const VALIDATION_RULES = {
  email: {
    required: true,
    email: true,
    requiredMessage: "Email is required",
    emailMessage: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 6,
    requiredMessage: "Password is required",
    minLengthMessage: "Password must be at least 6 characters",
  },
};

/**
 * LoginForm Component - Main export
 * @param {Object} props - Component props
 * @param {string} [props.redirectPath='/dashboard'] - Path to redirect after login
 * @param {Function} [props.onForgotPassword] - Callback for forgot password action
 */
export default function LoginForm({
  redirectPath = "/dashboard",
  onForgotPassword,
}) {
  // State management with consolidated form data
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  /**
   * Handle input changes with sanitization
   * @param {string} field - Field name
   * @param {string} value - Field value
   */
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: sanitizeInput(value),
      }));

      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }

      // Clear general error
      if (generalError) {
        setGeneralError("");
      }
    },
    [errors, generalError],
  );

  /**
   * Validate form data
   * @returns {boolean} - True if valid
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_RULES.email.requiredMessage;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = VALIDATION_RULES.email.emailMessage;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = VALIDATION_RULES.password.requiredMessage;
    } else if (formData.password.length < VALIDATION_RULES.password.minLength) {
      newErrors.password = VALIDATION_RULES.password.minLengthMessage;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handle form submission
   * @param {Event} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setGeneralError("");
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check rate limiting — 5 attempts per 5 minutes
    const rateLimit = checkRateLimit("login", 5, 300000);
    if (!rateLimit.allowed) {
      setGeneralError(
        `Too many login attempts. Please try again in ${Math.ceil(
          (rateLimit.resetTime - Date.now()) / 1000 / 60,
        )} minutes.`,
      );
      return;
    }

    setIsLoading(true);

    try {
      // Attempt login using mock authentication
      await mockLogin(formData.email, formData.password);

      // Validate and perform secure redirect
      const safeRedirect = validateRedirect(redirectPath, "/dashboard");
      window.location.href = safeRedirect;
    } catch (error) {
      logger.error("Login error:", error);
      setGeneralError(
        error.message ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Login form">
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

      {/* Email Field */}
      <div className="mb-3.5">
        <label
          htmlFor="login-email"
          className="block mb-1.5"
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: COLORS.text.muted,
            textTransform: "uppercase",
          }}
        >
          Email
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconMail size={15} color={COLORS.text.placeholder} />
          </span>
          <input
            type="email"
            id="login-email"
            name="email"
            className="hx-input w-full rounded-xl pl-10 pr-4 py-3.5 text-sm"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            style={{
              background: COLORS.background.input,
              border: `1px solid ${errors.email ? COLORS.border.error : COLORS.border.primary}`,
              color: COLORS.text.primary,
              fontFamily: "inherit",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
        {errors.email && (
          <p
            id="login-email-error"
            role="alert"
            style={{ fontSize: 12, color: COLORS.text.error, marginTop: 4 }}
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label
          htmlFor="login-password"
          className="block mb-1.5"
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: COLORS.text.muted,
            textTransform: "uppercase",
          }}
        >
          Password
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconKey size={15} color={COLORS.text.placeholder} />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            id="login-password"
            name="password"
            className="hx-input w-full rounded-xl pl-10 pr-11 py-3.5 text-sm"
            placeholder="••••••••••"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            autoComplete="current-password"
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            style={{
              background: COLORS.background.input,
              border: `1px solid ${errors.password ? COLORS.border.error : COLORS.border.primary}`,
              color: COLORS.text.primary,
              fontFamily: "inherit",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pw-toggle absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: COLORS.text.placeholder,
              padding: 2,
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <IconEyeOff size={15} color={COLORS.text.placeholder} />
            ) : (
              <IconEye size={15} color={COLORS.text.placeholder} />
            )}
          </button>
        </div>
        {errors.password && (
          <p
            id="login-password-error"
            role="alert"
            style={{ fontSize: 12, color: COLORS.text.error, marginTop: 4 }}
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          className="forgot-link"
          onClick={onForgotPassword}
          style={{
            background: "none",
            border: "none",
            fontSize: 13,
            color: COLORS.primary[500],
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "color 0.15s",
          }}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="submit-btn w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5"
        style={{
          background: isLoading
            ? "rgba(42,92,232,0.55)"
            : COLORS.gradient.primary,
          border: "none",
          color: COLORS.text.white,
          fontSize: 14.5,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: isLoading ? "not-allowed" : "pointer",
          boxShadow: isLoading
            ? "none"
            : COLORS.shadow?.lg || "0 4px 20px rgba(42,92,232,0.45)",
          letterSpacing: "0.01em",
          opacity: isLoading ? 0.7 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        {isLoading ? (
          <span className="hx-spinner" />
        ) : (
          <>
            <span>Sign In</span>
            <IconArrowRight size={15} color={COLORS.text.white} />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div
          className="flex-1"
          style={{ height: 1, background: "rgba(255,255,255,0.07)" }}
        />
        <span
          style={{
            fontSize: 11,
            color: COLORS.text.placeholder,
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          OR
        </span>
        <div
          className="flex-1"
          style={{ height: 1, background: "rgba(255,255,255,0.07)" }}
        />
      </div>

      {/* Register Link */}
      <p
        className="text-center mt-6"
        style={{
          fontSize: 13.5,
          color: COLORS.text.tertiary,
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          style={{
            color: COLORS.primary[500],
            fontWeight: 700,
            textDecoration: "none",
            transition: "color 0.15s",
          }}
          className="register-link hover:opacity-80 transition-opacity"
        >
          Create account →
        </Link>
      </p>
    </form>
  );
}

// Export validation rules for testing
export { VALIDATION_RULES };
