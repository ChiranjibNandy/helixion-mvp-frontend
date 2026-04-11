"use client";

import { useCallback } from "react";

// Props for the reusable Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

// Backdrop click handler hook for reusability
export function useModalBackdrop(onClose: () => void) {
  return useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );
}

// Reusable Modal component with backdrop and centered layout
export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalProps) {
  const handleBackdropClick = useModalBackdrop(onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <div
        className={`relative w-full max-w-md bg-bgStatCard rounded-xl border border-borderCard shadow-2xl ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
