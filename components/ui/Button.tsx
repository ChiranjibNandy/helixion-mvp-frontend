import { ButtonHTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type ButtonVariant = 'outline' | 'ghost' | 'solid';
type ButtonSize    = 'xs' | 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const VARIANT_MAP: Record<ButtonVariant, string> = {
  outline: 'border border-blue-500/30 text-blue-300 bg-transparent hover:bg-blue-500/10',
  ghost:   'bg-transparent text-white/40 hover:text-white/70 hover:bg-white/5',
  solid:   'bg-blue-700 text-white hover:bg-blue-600',
};

const SIZE_MAP: Record<ButtonSize, string> = {
  xs: 'text-[9px] px-2.5 py-0.5 rounded',
  sm: 'text-[11px] px-3 py-1 rounded-md',
  md: 'text-xs px-4 py-1.5 rounded-md',
};

// ─── Component ────────────────────────────────────────────────────────────────
export function Button({
  variant = 'outline',
  size = 'xs',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        transition-colors duration-150 cursor-pointer
        ${VARIANT_MAP[variant]} ${SIZE_MAP[size]} ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}