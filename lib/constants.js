/**
 * Centralized Design System Constants
 * 
 * This file contains all design tokens for consistent styling
 * across the application. Use these instead of hardcoded values.
 */

// ============================================
// COLOR PALETTE
// ============================================
export const COLORS = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Background Colors
  background: {
    main: '#060d1a',
    secondary: '#08101e',
    tertiary: '#0c1828',
    card: 'rgba(8,16,30,0.6)',
    input: '#0c1828',
    success: 'rgba(34,197,94,0.12)',
    error: 'rgba(239,68,68,0.1)',
  },
  
  // Text Colors
  text: {
    primary: '#e8edf5',
    secondary: '#c8d4e8',
    tertiary: '#7a8faa',
    muted: '#6b7d96',
    placeholder: '#3a4f6a',
    error: '#f87171',
    success: '#22c55e',
    white: '#ffffff',
  },
  
  // Border Colors
  border: {
    primary: '#1a2d45',
    secondary: '#0c1b30',
    focus: 'rgba(59,111,224,0.55)',
    error: 'rgba(239,68,68,0.5)',
  },
  
  // Semantic Colors
  semantic: {
    error: 'rgba(239,68,68,0.1)',
    errorBorder: 'rgba(239,68,68,0.25)',
    success: 'rgba(34,197,94,0.12)',
    successBorder: 'rgba(34,197,94,0.3)',
  },
  
  // Gradients
  gradient: {
    primary: 'linear-gradient(135deg, #2a5ce8 0%, #1e4bd4 100%)',
    secondary: 'linear-gradient(158deg, #071022 0%, #07122a 45%, #060d1c 100%)',
    logo: 'linear-gradient(135deg, #2554c7 0%, #1e40af 100%)',
    divider: 'linear-gradient(90deg, rgba(59,111,224,0.35), rgba(255,255,255,0.05) 60%, transparent)',
  },
};

// ============================================
// SPACING SYSTEM
// ============================================
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  
  // Component Specific
  input: {
    padding: '14px',
    iconGap: '10px',
  },
  label: {
    marginBottom: '6px',
  },
  field: {
    marginBottom: '14px',
  },
};

// ============================================
// TYPOGRAPHY
// ============================================
export const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Bricolage Grotesque', system-ui, sans-serif",
  },
  
  sizes: {
    xs: '10.5px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '14.5px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '28px',
    '4xl': '44px',
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  letterSpacing: {
    tight: '-0.5px',
    tighter: '-0.8px',
    tightest: '-1.5px',
    normal: '0',
    wide: '0.08em',
    wider: '0.1em',
    widest: '0.12em',
  },
  
  lineHeight: {
    tight: 1,
    snug: 1.1,
    normal: 1.5,
    relaxed: 1.65,
  },
};

// ============================================
// BORDERS & SHADOWS
// ============================================
export const BORDERS = {
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
  },
  
  width: {
    thin: '1px',
    medium: '2px',
  },
};

export const SHADOWS = {
  sm: '0 2px 8px rgba(0,0,0,0.1)',
  md: '0 4px 16px rgba(37,84,199,0.45)',
  lg: '0 4px 20px rgba(42,92,232,0.45)',
  xl: '0 6px 28px rgba(42,92,232,0.55)',
  focus: '0 0 0 3px rgba(59,111,224,0.25)',
};

// ============================================
// TRANSITIONS
// ============================================
export const TRANSITIONS = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
};

// ============================================
// Z-INDEX SCALE
// ============================================
export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  tooltip: 50,
};

// ============================================
// BREAKPOINTS
// ============================================
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// STYLE PRESETS (For Common Components)
// ============================================
export const STYLES = {
  // Input Base Styles
  input: {
    backgroundColor: COLORS.background.input,
    border: `1px solid ${COLORS.border.primary}`,
    borderRadius: BORDERS.radius.lg,
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    padding: `${SPACING.input.padding} ${SPACING.lg}`,
    paddingLeft: '40px',
    width: '100%',
  },
  
  // Label Base Styles
  label: {
    display: 'block',
    marginBottom: SPACING.label.marginBottom,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
    color: COLORS.text.muted,
    textTransform: 'uppercase',
  },
  
  // Button Primary Styles
  buttonPrimary: {
    background: COLORS.gradient.primary,
    border: 'none',
    borderRadius: BORDERS.radius.lg,
    color: COLORS.text.white,
    cursor: 'pointer',
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    padding: `${SPACING.input.padding} ${SPACING.lg}`,
    boxShadow: SHADOWS.lg,
    transition: TRANSITIONS.normal,
  },
  
  // Error Box Styles
  errorBox: {
    backgroundColor: COLORS.semantic.error,
    border: `1px solid ${COLORS.semantic.errorBorder}`,
    borderRadius: BORDERS.radius.md,
    color: COLORS.text.error,
    fontSize: TYPOGRAPHY.sizes.sm,
    padding: `${SPACING.sm} ${SPACING.md}`,
  },
};

export default {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDERS,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
  BREAKPOINTS,
  STYLES,
};
