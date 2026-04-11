"use client";

import { Loader2 } from "lucide-react";

// Props for individual action button
interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  loadingLabel?: string;
  icon?: React.ReactNode;
}

// Props for the ModalFooter component
interface ModalFooterProps {
  primaryAction: ActionButtonProps;
  secondaryAction?: ActionButtonProps;
  className?: string;
}

// Variant styles for buttons
const variantStyles = {
  primary: "bg-accentGreen hover:bg-accentGreenHover text-white",
  secondary:
    "bg-transparent border border-borderCard text-textSecondary hover:bg-bgMain",
  danger: "bg-accentRed hover:bg-accentRedHover text-white",
} as const;

// Individual action button component
function ActionButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  loadingLabel,
  icon,
}: ActionButtonProps) {
  const baseStyles =
    "flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variantClass = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantClass}`}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingLabel || label}
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}

// Modal footer with action buttons
export default function ModalFooter({
  primaryAction,
  secondaryAction,
  className = "",
}: ModalFooterProps) {
  return (
    <div className={`flex gap-3 pt-2 ${className}`}>
      {secondaryAction && (
        <ActionButton {...secondaryAction} variant="secondary" />
      )}
      <ActionButton {...primaryAction} variant="primary" />
    </div>
  );
}

// Re-export ActionButtonProps for external use
export type { ActionButtonProps };
