"use client";

import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { RolesTable } from "@/components/admin/roles/RolesTable";
import { useRolesStats } from "@/hooks/useRolesStats";

export default function RolesPage() {
  const { data: stats, isLoading } = useRolesStats();
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
      {/* ── Top Role Count Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-4">
        <StatsCard
          title="Employees"
          value={isLoading ? 0 : (stats?.employees ?? 0)}
        />
        <StatsCard
          title="Training providers"
          value={isLoading ? 0 : (stats?.trainingProviders ?? 0)}
        />
        <StatsCard
          title="Managers"
          value={isLoading ? 0 : (stats?.managers ?? 0)}
        />
        <StatsCard
          title="Admins"
          value={isLoading ? 0 : (stats?.admins ?? 0)}
        />
      </div>

      {/* ── Role Management Table ────────────────────────────────────────── */}
      <RolesTable />
    </div>
  );
}
