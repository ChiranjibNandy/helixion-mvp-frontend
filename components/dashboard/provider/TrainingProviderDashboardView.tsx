import { QuickActionCard } from "./QuickActionCard";
import { t } from "@/lib/i18n";
import { RecentActivityList } from "./RecentActivityList";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { DashboardTopProgram, ProviderDashboardResponse, providerService } from "@/services/provider.service";
import { AppAlert } from "@/components/shared/app-alert";
import { DashboardStats } from "@/components/shared/dashboard-stats";
import { DashboardSectionCard } from "@/components/shared/dashboard-section-card";
import { DataTable } from "@/components/shared/data-table";
import { getProviderDashboardStats } from "@/constants/provider-dashboard-stats";
import { PROVIDER_PROGRAM_COLUMNS } from "@/constants/provider-program-columns";
import { getProviderQuickActions } from "@/constants/provider-quick-actions";
import { Plus } from "lucide-react";
import { ROUTES } from "@/constants/navigation";
import Link from "next/link";

export default function TrainingProviderDashboardView({ name }: { name: string }) {
  const [data, setData] = useState<ProviderDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await providerService.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError(true);
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
        title={t("dashboard.errorTitle")}
        description={t("dashboard.errorDescription")}
      />
    );
  }

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }


  const stats = getProviderDashboardStats(
    data.overview
  );

  const quickActions = getProviderQuickActions();

  return (
    <div className="flex flex-col gap-y-4">
      {/* Welcome and Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">
            {t("providerDashboard.welcome", { name })}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-bgButton border-borderCard text-textSecondary text-xs">
            {t("providerDashboard.quickActions.bulkUpload")}
          </Button>
          <Button className="bg-primary hover:bg-primaryDark text-white text-xs gap-1">
            <Plus className="size-4" />
            {t("providerDashboard.quickActions.createProgram")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />


      {/* Main Content: Table and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardSectionCard
            title="Listed Training Programs"
            subtitle="Upcoming programs available for enrollment"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href={ROUTES.PROVIDER.PROGRAMS.ROOT}>
                  View all →
                </Link>
              </Button>
            }
          >
            <DataTable<DashboardTopProgram>
              data={data.topPrograms}
              columns={PROVIDER_PROGRAM_COLUMNS}
              emptyMessage="No programs listed yet."
            />
          </DashboardSectionCard>
        </div>
        <div>
          <RecentActivityList activities={data.recentActivities} />
        </div>
      </div>

      {/* Quick Actions at the Bottom */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.href}
            title={action.title}
            description={action.description}
            linkText={action.linkText}
            href={action.href}
          />
        ))}
      </div>
    </div>
  );
}

