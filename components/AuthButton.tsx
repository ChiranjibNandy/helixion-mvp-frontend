"use client";

import { AuthButtonProps } from '@/types/auth';

/**
 * Authentication button with loading state support
 */
export default function AuthButton({ children, onClick, type = 'submit', loading = false }: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="
        w-full py-3.5 rounded-lg font-bold text-white text-sm
        transition-all duration-200
        hover:brightness-110 hover:scale-[1.01]
        active:scale-[0.99]
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        bg-gradient-to-br from-primaryDark to-primary
        shadow-glow
      "
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}