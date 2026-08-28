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
import { PendingReviewRow, TrainingDeptDashboardData } from "@/types/trainingDept";
import { TRAINING_DEPT_PENDING_REVIEWS_COLUMNS } from "@/constants/training-dept-dashboard-columns";
import { getTrainingDeptDashboardStats } from "@/utils/training-dept-dashboard";
import { getTrainingDeptQuickActions } from "@/constants/training-dept-quick-actions";
import { fetchTrainingDeptDashboardData } from "@/services/trainingDeptService";
import { t } from "@/lib/i18n";
import { useSortedPagination } from "@/hooks/useSortedPagination";
import { withSortableDateColumns } from "@/components/shared/SortableDateColumns";

const PAGE_SIZE = 10;

export default function CtdDashboardView({ name }: { name: string }) {
  const [data, setData] = useState<TrainingDeptDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  const { page, setPage, totalPages, pagedRows, sortKey, sortDir, handleSort } =
    useSortedPagination<PendingReviewRow>(data?.pendingReviews ?? [], PAGE_SIZE);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchTrainingDeptDashboardData();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch CTD dashboard", err);
        setError(err instanceof Error ? err : new Error(t('trainingDeptDashboard.errorTitle')));
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
        title={t('trainingDeptDashboard.errorTitle')}
        description={error.message ?? t('trainingDeptDashboard.errorDescription')}
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

  const stats = getTrainingDeptDashboardStats(data.summary);
  const quickActions = getTrainingDeptQuickActions();
  const columns = withSortableDateColumns(TRAINING_DEPT_PENDING_REVIEWS_COLUMNS, sortKey, sortDir, handleSort);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">
            {t('trainingDeptDashboard.welcome', { name })}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard/programs">
              <Plus />
              {t('trainingDeptDashboard.enroll')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary stat cards */}
      <DashboardStats
        stats={stats}
        columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      />

      {/* Pending reviews + Approval status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardSectionCard
            title={t('trainingDeptDashboard.pendingApprovalsTitle')}
            subtitle={t('trainingDeptDashboard.pendingApprovalsSubtitle')}
            count={data.pendingReviews.length}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/ctd-approvals">{t('trainingDeptDashboard.viewAll')}</Link>
              </Button>
            }
          >
            <DataTable<PendingReviewRow>
              data={pagedRows}
              columns={columns}
              rowKey={(row) => row._id}
              emptyMessage={t('trainingDeptDashboard.noPendingApprovals')}
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
