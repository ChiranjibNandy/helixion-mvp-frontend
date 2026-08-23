'use client';

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApprovalStatusCard } from "../employee/ApprovalStatusCard";
import { DashboardStats } from "@/components/shared/dashboard-stats";
import { DashboardSectionCard } from "@/components/shared/dashboard-section-card";
import { DataTable } from "@/components/shared/data-table";
import { QuickActionCard } from "../provider/QuickActionCard";
import { AppAlert } from "@/components/shared/app-alert";
import { Spinner } from "@/components/ui/spinner";
import PaginationController from "@/components/ui/pagination";
import Link from "next/link";
import { TeamEnrollmentRow, ManagerDashboardData } from "@/types/manager";
import { MANAGER_PENDING_ENROLLMENTS_COLUMNS } from "@/constants/manager-dashboard-columns";
import { getManagerDashboardStats } from "@/utils/manager-dashboard";
import { getManagerQuickActions } from "@/constants/manager-quick-actions";
import { fetchManagerDashboardData } from "@/services/managerService";
import { useSortedPagination } from "@/hooks/useSortedPagination";
import { withSortableDateColumns } from "@/components/shared/SortableDateColumns";

const PAGE_SIZE = 10;

export default function ManagerDashboardView({ name }: { name: string }) {
  const [data, setData] = useState<ManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Hooks must run unconditionally — falls back to [] before data has loaded.
  const { page, setPage, totalPages, pagedRows, sortKey, sortDir, handleSort } =
    useSortedPagination<TeamEnrollmentRow>(data?.pendingTeamEnrollments ?? [], PAGE_SIZE);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchManagerDashboardData();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch manager dashboard", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch manager dashboard"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (error) {
    return (
      <AppAlert
        variant="destructive"
        title="Failed to load dashboard"
        description={error.message ?? "Could not fetch dashboard data. Please try again later."}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const stats = getManagerDashboardStats(data.summary);
  const quickActions = getManagerQuickActions();
  const columns = withSortableDateColumns(MANAGER_PENDING_ENROLLMENTS_COLUMNS, sortKey, sortDir, handleSort);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">
            Welcome back, {name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard/programs">
              <Plus />
              Enroll
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary stat cards */}
      <DashboardStats
        stats={stats}
        columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      />

      {/* Pending team enrollments + Approval status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardSectionCard
            title="Pending Team Enrollments"
            subtitle="Awaiting your approval"
            count={data.pendingTeamEnrollments.length}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/approvals">View all</Link>
              </Button>
            }
          >
            <DataTable<TeamEnrollmentRow>
              data={pagedRows}
              columns={columns}
              rowKey={(row) => row._id}
              emptyMessage="No pending team enrollments"
            />
            {totalPages > 1 && (
              <div className="px-4">
                <PaginationController
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </DashboardSectionCard>
        </div>

        <div>
          <ApprovalStatusCard stats={data.approvalStats} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            linkText={action.linkText}
            href={action.href}
            icon={action.icon}
            iconBg={action.iconBg}
          />
        ))}
      </div>
    </div>
  );
}
