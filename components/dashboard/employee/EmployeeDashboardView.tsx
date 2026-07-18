'use client';

import { ApprovalStatusCard } from "./ApprovalStatusCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchEmployeeDashboardData } from "@/services/employeeService";
import { AppAlert } from "@/components/shared/app-alert";
import { Spinner } from "@/components/ui/spinner";
import { t } from "@/lib/i18n";
import { DashboardStats } from "@/components/shared/dashboard-stats";
import { DashboardSectionCard } from "@/components/shared/dashboard-section-card";
import { DataTable } from "@/components/shared/data-table";
import { QuickActionCard } from "../provider/QuickActionCard";
import Link from "next/link";
import { ListedProgram } from "@/types/employee";
import { EMPLOYEE_PROGRAM_COLUMNS } from "@/constants/employee-dashboard-columns";
import { getEmployeeDashboardStats } from "@/utils/employee-dashboard";
import { getQuickActions } from "@/constants/employee-quick-actions";
import { ROUTES } from "@/constants/navigation";

export default function EmployeeDashboardView({ name }: { name: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await fetchEmployeeDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <AppAlert
        variant="destructive"
        title={t('dashboard.errorTitle')}
        description={error.message}
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

  const stats = getEmployeeDashboardStats(data.summary ?? data);
  const quickActions = getQuickActions();

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-textSidebarMuted text-xs mb-0.5">
            {t('dashboard.employeeBreadcrump')}
          </p>
          <h1 className="text-white text-2xl font-bold">{t('dashboard.welcome', { name })}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href={ROUTES.EMPLOYEE.PROGRAMS}>
              <Plus />
              {t('dashboard.enroll')}
            </Link>
          </Button>
        </div>
      </div>

      <DashboardStats
        stats={stats}
        columns="grid-cols-1 sm:grid-cols-3"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardSectionCard
            title={t('table.listedTitle')}
            subtitle={t('table.listedSubtitle')}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/employee/programs">
                  {t('table.viewAll')}
                </Link>
              </Button>
            }
          >
            <DataTable<ListedProgram>
              data={data.listedPrograms}
              columns={EMPLOYEE_PROGRAM_COLUMNS}
              emptyMessage={t('table.noPrograms')}
            />
          </DashboardSectionCard>
        </div>
        <div>
          <ApprovalStatusCard stats={data.approvalStats} />
        </div>
      </div>

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
