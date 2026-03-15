/**
 * Reusable UI Components
 * 
 * This module provides standardized, accessible components
 * for consistent UI across the application.
 */

'use client';

import React, { forwardRef, ReactNode, InputHTMLAttributes, ButtonHTMLAttributes, LabelHTMLAttributes } from 'react';
import { COLORS, TYPOGRAPHY, SPACING, BORDERS, SHADOWS, TRANSITIONS } from '../../lib/constants';

// ============================================
// TYPES
// ============================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  rightElement?: ReactNode;
  error?: boolean;
}

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export interface FormFieldProps {
  label?: string;
  name?: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export interface PasswordStrengthProps {
  password?: string;
}

export interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  label: string;
  className?: string;
}

export interface DividerProps {
  text?: string;
}

export interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: ReactNode;
}

// ============================================
// INPUT COMPONENT
// ============================================

/**
 * Reusable Input component with icon support
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  rightElement,
  error = false,
  className = '',
  style = {},
  ...props
}, ref) => {
  const baseStyles: React.CSSProperties = {
    backgroundColor: COLORS.background.input,
    border: `1px solid ${error ? COLORS.border.error : COLORS.border.primary}`,
    borderRadius: BORDERS.radius.lg,
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    padding: `${SPACING.input.padding} ${SPACING.lg}`,
    paddingLeft: icon ? '40px' : SPACING.lg,
    paddingRight: rightElement ? '44px' : SPACING.lg,
    width: '100%',
    transition: `border-color ${TRANSITIONS.fast}, box-shadow ${TRANSITIONS.fast}`,
    outline: 'none',
    ...style,
  };

  return (
    <div className="relative" style={{ width: '100%' }}>
      {icon && (
        <span 
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        >
          {icon}
        </span>
      )}
      
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`hx-input ${className}`}
        style={baseStyles}
        {...props}
      />
      
      {rightElement && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10">
          {rightElement}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ============================================
// LABEL COMPONENT
// ============================================

/**
 * Form label component
 */
export const Label = ({
  children,
  htmlFor,
  required = false,
  className = '',
  ...props
}: LabelProps) => {
  const styles: React.CSSProperties = {
    display: 'block',
    marginBottom: SPACING.label.marginBottom,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
    color: COLORS.text.muted,
    textTransform: 'uppercase',
  };

  return (
    <label htmlFor={htmlFor} className={className} style={styles} {...props}>
      {children}
      {required && <span style={{ color: COLORS.text.error, marginLeft: '2px' }}>*</span>}
    </label>
  );
};

// ============================================
// FORM FIELD COMPONENT
// ============================================

/**
 * Complete form field with label, input, and error
 */
export const FormField = ({
  label,
  name,
  children,
  error,
  className = '',
}: FormFieldProps) => {
  return (
    <div 
      className={`mb-${SPACING.field.marginBottom} ${className}`}
      style={{ marginBottom: SPACING.field.marginBottom }}
    >
      {label && <Label htmlFor={name}>{label}</Label>}
      {children}
      {error && (
        <p 
          style={{ 
            fontSize: TYPOGRAPHY.sizes.sm, 
            color: COLORS.text.error, 
            marginTop: SPACING.xs,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================
// BUTTON COMPONENT
// ============================================

/**
 * Reusable Button component
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}: ButtonProps) => {
  const sizeStyles = {
    sm: { padding: `${SPACING.sm} ${SPACING.md}`, fontSize: TYPOGRAPHY.sizes.sm },
    md: { padding: `${SPACING.input.padding} ${SPACING.lg}`, fontSize: TYPOGRAPHY.sizes.lg },
    lg: { padding: `${SPACING.md} ${SPACING.xl}`, fontSize: TYPOGRAPHY.sizes.xl },
  };

  const variantStyles = {
    primary: {
      background: COLORS.gradient.primary,
      color: COLORS.text.white,
      border: 'none',
      boxShadow: SHADOWS.lg,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: COLORS.primary[500],
      border: `1px solid ${COLORS.border.primary}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: COLORS.primary[500],
      border: 'none',
    },
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: BORDERS.radius.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    opacity: loading || disabled ? 0.7 : 1,
    transition: TRANSITIONS.normal,
    width: '100%',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`submit-btn ${className}`}
      style={baseStyles}
      {...props}
    >
      {loading ? (
        <span className="hx-spinner" />
      ) : (
        children
      )}
    </button>
  );
};

// ============================================
// ERROR MESSAGE COMPONENT
// ============================================

/**
 * Error message display component
 */
export const ErrorMessage = ({ message, className = '' }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={`rounded-lg px-3.5 py-2.5 mb-4 ${className}`}
      style={{
        backgroundColor: COLORS.semantic.error,
        border: `1px solid ${COLORS.semantic.errorBorder}`,
        color: COLORS.text.error,
        fontSize: TYPOGRAPHY.sizes.sm,
      }}
    >
      {message}
    </div>
  );
};

// ============================================
// PASSWORD STRENGTH COMPONENT
// ============================================

/**
 * Password strength indicator
 */
export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  if (!password) return null;

  const { calculatePasswordStrength } = require('../../lib/security');
  const strength = calculatePasswordStrength(password);

  return (
    <div className="mt-2">
      <div
        className="rounded-full mb-1"
        style={{ 
          height: 3, 
          backgroundColor: COLORS.background.tertiary, 
          overflow: 'hidden' 
        }}
      >
        <div
          className="strength-bar"
          style={{ 
            width: strength.width, 
            backgroundColor: strength.color, 
            height: '100%',
            transition: 'width 300ms ease, background-color 300ms ease',
          }}
        />
      </div>
      <span style={{ 
        fontSize: TYPOGRAPHY.sizes.xs, 
        color: strength.color, 
        fontWeight: TYPOGRAPHY.weights.semibold 
      }}>
        {strength.label}
      </span>
    </div>
  );
};

// ============================================
// ICON BUTTON COMPONENT
// ============================================

/**
 * Icon button for actions like password visibility toggle
 */
export const IconButton = ({
  icon,
  onClick,
  label,
  className = '',
}: IconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`pw-toggle ${className}`}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: COLORS.text.placeholder,
        padding: SPACING.xs,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `color ${TRANSITIONS.fast}`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = COLORS.text.primary}
      onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.placeholder}
    >
      {icon}
    </button>
  );
};

// ============================================
// DIVIDER COMPONENT
// ============================================

/**
 * Divider with optional text
 */
export const Divider = ({ text }: DividerProps) => {
  const lineStyles: React.CSSProperties = {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  };

  return (
    <div className="flex items-center gap-3 my-4">
      <div style={lineStyles} />
      {text && (
        <span style={{ 
          fontSize: TYPOGRAPHY.sizes.xs, 
          color: COLORS.text.placeholder, 
          fontWeight: TYPOGRAPHY.weights.semibold,
          letterSpacing: TYPOGRAPHY.letterSpacing.wide,
        }}>
          {text}
        </span>
      )}
      <div style={lineStyles} />
    </div>
  );
};

// ============================================
// LINK STYLES
// ============================================

/**
 * Get link styles object
 * @param {boolean} isBold - Whether to use bold font
 * @returns {Object} - Style object
 */
export const getLinkStyles = (isBold = true): React.CSSProperties => ({
  color: COLORS.primary[500],
  fontWeight: isBold ? TYPOGRAPHY.weights.bold : TYPOGRAPHY.weights.medium,
  textDecoration: 'none',
  transition: `color ${TRANSITIONS.fast}`,
  cursor: 'pointer',
});

// ============================================
// CHECKBOX COMPONENT
// ============================================

/**
 * Styled checkbox component
 */
export const Checkbox = ({
  id,
  checked,
  onChange,
  label,
}: CheckboxProps) => {
  return (
    <div className="flex items-start gap-2.5">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 cursor-pointer hx-checkbox"
        style={{ accentColor: COLORS.primary[600] }}
      />
      <label
        htmlFor={id}
        className="cursor-pointer"
        style={{ 
          fontSize: TYPOGRAPHY.sizes.base, 
          color: COLORS.text.muted,
          lineHeight: TYPOGRAPHY.lineHeight.normal,
        }}
      >
        {label}
      </label>
    </div>
  );
};

// Export all components
const FormComponents = {
  Input,
  Label,
  FormField,
  Button,
  ErrorMessage,
  PasswordStrength,
  IconButton,
  Divider,
  getLinkStyles,
  Checkbox,
};

export default FormComponents;
