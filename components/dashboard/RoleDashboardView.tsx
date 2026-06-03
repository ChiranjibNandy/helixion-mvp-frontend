"use client";

import { useEffect, useState } from "react";
import { fetchEmployeeDashboardData } from "@/services/employeeService";
import { t } from "@/lib/i18n";
import { AppAlert } from "../shared/app-alert";
import { USER_ROLES } from "@/constants/navigation";
import { providerService, ProviderDashboardResponse, DashboardTopProgram, DashboardActivity } from "@/services/provider.service";
import StatCard from "../ui/status-card";
import { LiveProgramsTable } from "./provider/LiveProgramsTable";
import { RecentActivityList } from "./provider/RecentActivityList";
import { QuickActionCard } from "./provider/QuickActionCard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { ROUTES } from "@/constants/navigation";

//Employee Dashboard

function EmployeeDashboardView() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await fetchEmployeeDashboardData();
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
        title={t('dashboard.errorTitle')}
        description={t('dashboard.errorDescription')}
      />
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>

    </>
  );
}


//function Training-provider Dashboard

function TrainingProviderDashboardView({ name }: { name: string }) {
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

  return (
    <div className="flex flex-col gap-8 pb-10">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: t("providerDashboard.stats.livePrograms"),
            value: data.overview.livePrograms,
            subtitle: t("providerDashboard.stats.allPublished"),
            subtitleColor: "text-accentGreen"
          },
          {
            title: t("providerDashboard.stats.totalEnrolled"),
            value: data.overview.totalEnrollments,
            subtitle: t("providerDashboard.stats.acrossPrograms", { count: data.overview.livePrograms }),
            subtitleColor: "text-textSidebarMuted"
          },
          {
            title: t("providerDashboard.stats.drafts"),
            value: data.overview.drafts,
            subtitle: t("providerDashboard.stats.awaitingPublish"),
            subtitleColor: "text-accentOrange"
          },
          {
            title: t("providerDashboard.stats.avgFillRate"),
            value: `${data.overview.averageFillRate}%`,
            subtitle: t("providerDashboard.stats.capacityUtilized"),
            subtitleColor: "text-accentGreen"
          }
        ].map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            subtitleColor={card.subtitleColor}
          />
        ))}
      </div>

      {/* Main Content: Table and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveProgramsTable programs={data.topPrograms} />
        </div>
        <div>
          <RecentActivityList activities={data.recentActivities} />
        </div>
      </div>

      {/* Quick Actions at the Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: t("providerDashboard.quickActions.publishSingle.title"),
            description: t("providerDashboard.quickActions.publishSingle.desc"),
            linkText: t("providerDashboard.quickActions.publishSingle.link"),
            href: ROUTES.PROVIDER.PROGRAMS.CREATE
          },
          {
            title: t("providerDashboard.quickActions.batchPublish.title"),
            description: t("providerDashboard.quickActions.batchPublish.desc"),
            linkText: t("providerDashboard.quickActions.batchPublish.link"),
            href: ROUTES.PROVIDER.PROGRAMS.BULK
          },
          {
            title: t("providerDashboard.quickActions.exportEnrolment.title"),
            description: t("providerDashboard.quickActions.exportEnrolment.desc"),
            linkText: t("providerDashboard.quickActions.exportEnrolment.link"),
            href: ROUTES.PROVIDER.PROGRAMS.EXPORT
          }
        ].map((action, index) => (
          <QuickActionCard
            key={index}
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







interface RoleDashboardViewProps {
  role: string;
  name: string;
}

export function RoleDashboardView({ role, name }: RoleDashboardViewProps) {
  if (role === USER_ROLES.EMPLOYEE) {
    return <EmployeeDashboardView />;
  }

  if (role === USER_ROLES.TRAINING_PROVIDER) {
    return <TrainingProviderDashboardView name={name} />;
  }

  return null

}