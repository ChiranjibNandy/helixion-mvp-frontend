"use client";

import { X } from "lucide-react";

// Props for the ModalHeader component
interface ModalHeaderProps {
  title: string;
  titleId: string;
  onClose: () => void;
  disabled?: boolean;
}

// Modal header with title and close button
export default function ModalHeader({
  title,
  titleId,
  onClose,
  disabled = false,
}: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-borderCard">
      <h2 id={titleId} className="text-white text-lg font-semibold">
        {title}
      </h2>
      <button
        onClick={onClose}
        disabled={disabled}
        className="text-textSidebarMuted hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Close modal"
      >
        <X size={20} />
      </button>
    </div>
  );
}
