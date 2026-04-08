

"use client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SidebarFooterProps {
  onSignOut?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SidebarFooter({ onSignOut }: SidebarFooterProps) {
  return (
    <div className="px-3.5 py-2.5 border-t border-white/[0.06]">
      <button
        onClick={onSignOut}
        className="text-[10px] text-white/25 hover:text-white/50 transition-colors duration-150 cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
}