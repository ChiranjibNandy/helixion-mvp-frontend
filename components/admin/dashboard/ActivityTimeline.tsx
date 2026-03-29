"use client";

import { cn } from "@/lib/utils";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import type { UserStatus } from "@/types/registration";
import { formatRelativeTime } from "@/utils/userUtils";

function statusToType(status: UserStatus): "success" | "danger" | "neutral" {
  if (status === "active") return "success";
  if (status === "denied") return "danger";
  return "neutral";
}

function activityCopy(name: string, status: UserStatus, role?: string): string {
  const roleBit = role ? ` — role: ${role}` : "";
  switch (status) {
    case "pending":
      return `${name} registered — pending approval`;
    case "active":
      return `${name} approved${roleBit}`;
    case "denied":
      return `${name} — registration denied`;
    default:
      return `${name} — updated`;
  }
}

export function ActivityTimeline() {
  const { data: users, isLoading, isError } = useRecentActivity(10);

  return (
    <div className="bg-bgCard border border-borderDark rounded-xl p-6 flex flex-col h-full">
      <h3 className="text-sm font-medium text-textPrimary tracking-tight mb-6">
        Recent activity
      </h3>

      <div className="flex flex-col gap-5 flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-textMuted">Loading activity…</p>
        ) : isError ? (
          <p className="text-sm text-statusInactive" role="alert">
            Could not load recent activity.
          </p>
        ) : !users?.length ? (
          <p className="text-sm text-textMuted">No recent registrations yet.</p>
        ) : (
          users.map((user) => {
            const type = statusToType(user.status);
            return (
              <div key={user.id} className="flex gap-3">
                <div
                  className={cn(
                    "mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm relative z-10",
                    type === "success" && "bg-statusActive",
                    type === "danger" && "bg-statusInactive",
                    type === "neutral" && "bg-textMuted"
                  )}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-textPrimary tracking-tight leading-snug">
                    {activityCopy(user.name, user.status, user.role)}
                  </span>
                  <span className="text-xs text-textMuted mt-0.5">
                    {formatRelativeTime(user.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
