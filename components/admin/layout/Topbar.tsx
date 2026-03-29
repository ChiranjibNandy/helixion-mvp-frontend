"use client";

import { usePathname } from "next/navigation";

export function Topbar() {
  const pathname = usePathname();

  // Simple static mapping for breadcrumb (extendable later)
  const getBreadcrumb = (path: string) => {
    if (path === "/admin") return "Dashboard";
    if (path.startsWith("/admin/registrations") || path.startsWith("/admin/users")) {
      return (
        <span className="flex items-center gap-2">
          <span className="text-textMuted">Users</span>
          <span>/</span>
          <span className="text-textPrimary font-semibold">All users</span>
        </span>
      );
    }
    if (path.startsWith("/admin/roles")) {
      return (
        <span className="flex items-center gap-2">
          <span className="text-textMuted">Users</span>
          <span>/</span>
          <span className="text-textPrimary font-semibold">Roles & permissions</span>
        </span>
      );
    }
    return "Dashboard";
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-bgMain border-b border-borderDark sticky top-0 z-10 w-full">
      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <h1 className="text-lg font-medium text-textPrimary tracking-tight">
        {getBreadcrumb(pathname)}
      </h1>

      {/* ── Right Utilities ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button
          className="relative p-2 text-textMuted hover:text-textPrimary transition-colors rounded-full hover:bg-bgHover focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="View notifications"
        >
          {/* Custom SVG Bell to match screenshot */}
          <svg
            xmlns="http://www.w3.org/polite/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {/* Notification Dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accentYellow border-2 border-bgMain" />
        </button>

        {/* Date Display */}
        <div className="text-sm font-medium text-textMuted">
          {formattedDate}
        </div>
      </div>
    </header>
  );
}
