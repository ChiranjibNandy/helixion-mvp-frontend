"use client";

import { useState, useCallback } from "react";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { PendingPanel } from "@/components/admin/dashboard/PendingPanel";
import { ActivityTimeline } from "@/components/admin/dashboard/ActivityTimeline";
import { PlaceholderCard } from "@/components/admin/dashboard/PlaceholderCard";
import { ApproveModal } from "@/components/admin/ApproveModal";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { approveUser } from "@/lib/api/registrations";
import { useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "@/hooks/useDashboardStats";
import type { User, Role } from "@/types/registration";

export default function DashboardPage() {
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();
  const queryClient = useQueryClient();
  const [approveModalUser, setApproveModalUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = useCallback((user: User) => {
    setApproveModalUser(user);
  }, []);

  const handleDeny = useCallback((userId: string) => {
    // TODO: Implement registration denial logic
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Dashboard] handleDeny called but not yet implemented.");
    }
  }, []);


  const handleConfirmApproval = useCallback(async (role: Role, note?: string) => {
    if (!approveModalUser) return;
    
    try {
      setIsSubmitting(true);
      await approveUser(approveModalUser.id, { role, note });
      
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats });
      setApproveModalUser(null);
    } catch (error) {
      console.error("Failed to approve user:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [approveModalUser, queryClient]);

  const handleCloseApproveModal = useCallback(() => {
    if (!isSubmitting) {
      setApproveModalUser(null);
    }
  }, [isSubmitting]);

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
        <div className="hidden xl:block" />
      </div>

      {/* ── Main Panels ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[400px]">
        <PendingPanel 
          users={stats?.pendingList ?? []} 
          isLoading={isLoading}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
        <ActivityTimeline />
      </div>

      {/* ── Bottom Placeholders ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlaceholderCard title="Reports & exports" />
        <PlaceholderCard title="Integrations" />
        <PlaceholderCard title="Platform settings" />
      </div>

      <ApproveModal
        user={approveModalUser}
        open={!!approveModalUser}
        onClose={handleCloseApproveModal}
        onConfirm={handleConfirmApproval}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
