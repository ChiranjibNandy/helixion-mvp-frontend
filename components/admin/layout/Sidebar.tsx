"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/useDashboardStats";

interface NavItem {
  label: string;
  href: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_DATA: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin" },
    ],
  },
  {
    title: "Users",
    items: [
      { label: "Pending registrations", href: "/admin/registrations/pending" },
      { label: "All users", href: "/admin/users" },
      { label: "Roles & permissions", href: "/admin/roles" },
      { label: "Bulk import", href: "/admin/users/import" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Programmes", href: "/admin/programmes" },
      { label: "Audit log", href: "/admin/audit" },
    ],
  },
  {
    title: "Coming soon",
    items: [
      { label: "Reports", href: "/admin/reports" },
      { label: "Integrations", href: "/admin/integrations" },
      { label: "Settings", href: "/admin/settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  // Highlight exact match for /admin, else match prefix for sub-routes
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-[260px] flex flex-col bg-bgSidebar border-r border-borderDark text-textMuted">
      {/* ── Logo Area ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-borderDark flex-shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white font-bold text-sm tracking-wide">
          Hx
        </div>
        <span className="text-textPrimary font-semibold text-lg tracking-wide">
          Helixion
        </span>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        {NAV_DATA.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-150 relative",
                        active
                          ? "bg-bgHover text-textPrimary font-medium"
                          : "text-textSecondary hover:bg-bgHover/50 hover:text-textPrimary"
                      )}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-primary" />
                      )}
                      
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-textMuted opacity-50 block" />
                        {item.label}
                      </span>
                      
                      {item.href === "/admin/registrations/pending" ? (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-statusPendingBg text-statusPending text-[10px] font-bold">
                          {statsLoading ? "…" : stats?.pendingApproval ?? 0}
                        </span>
                      ) : item.badge !== undefined ? (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-statusPendingBg text-statusPending text-[10px] font-bold">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Profile Footer ───────────────────────────────────────────────── */}
      <div className="p-4 border-t border-borderDark mt-auto">
        <div className="flex items-center gap-3 w-full p-2 py-3 rounded-md hover:bg-bgHover transition-colors cursor-pointer">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-textPrimary truncate">Admin</p>
            <p className="text-xs text-textMuted truncate">Super admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
