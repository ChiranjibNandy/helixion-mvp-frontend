"use client";

import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { PendingPanel } from "@/components/admin/dashboard/PendingPanel";
import { ActivityTimeline } from "@/components/admin/dashboard/ActivityTimeline";
import { PlaceholderCard } from "@/components/admin/dashboard/PlaceholderCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
      {isError && (
        <div
          className="rounded-lg border border-statusInactive/40 bg-statusInactive/10 px-4 py-3 text-sm text-textSecondary flex flex-wrap items-center justify-between gap-3"
          role="alert"
        >
          <span>
            Dashboard data could not be loaded
            {error instanceof Error ? `: ${error.message}` : "."}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-accentBlue font-medium hover:underline"
          >
            Retry
          </button>
        </div>
      )}
      {/* ── Top Stats Row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total users"
          value={isLoading ? 0 : (stats?.totalUsers ?? 0)}
          subtitle={<span className="text-textMuted font-normal text-sm">All registered</span>}
        />
        <StatsCard
          title="Pending approval"
          value={isLoading ? 0 : (stats?.pendingApproval ?? 0)}
          subtitle={<span className="text-statusPending font-medium text-sm">Awaiting action</span>}
        />
        <StatsCard
          title="Deactivated"
          value={isLoading ? 0 : (stats?.deactivated ?? 0)}
          subtitle={<span className="text-textMuted font-normal text-sm">All time</span>}
        />
        {/* Placeholder to match the grid if we wanted 4 columns, but the screenshot has 3 with a gap mostly? 
            Wait, Screenshot 1 has 4 columns for stats, the rightmost is blank/empty space.
            Using grid-cols-4 and leaving the last column empty perfectly replicates the width. */}
        <div className="hidden xl:block" />
      </div>

      {/* ── Main Panels ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[400px]">
        {/* Pass live users array to PendingPanel */}
        <PendingPanel users={stats?.pendingList ?? []} isLoading={isLoading} />
        <ActivityTimeline />
      </div>

      {/* ── Bottom Placeholders ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlaceholderCard title="Reports & exports" />
        <PlaceholderCard title="Integrations" />
        <PlaceholderCard title="Platform settings" />
      </div>
    </div>
  );
}
