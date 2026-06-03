import { ROUTES } from "@/constants/navigation";
import { QuickActionCard } from "./QuickActionCard";
import { t } from "@/lib/i18n";
import { LiveProgramsTable } from "./LiveProgramsTable";
import { RecentActivityList } from "./RecentActivityList";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { DashboardTopProgram, ProviderDashboardResponse, providerService } from "@/services/provider.service";
import { BookOpen, FileText, Link, Plus, TrendingUp, Users } from "lucide-react";
import { AppAlert } from "@/components/shared/app-alert";
import { DashboardStats } from "@/components/shared/dashboard-stats";
import { DashboardSectionCard } from "@/components/shared/dashboard-section-card";
import { DataTable } from "@/components/shared/data-table";
import { formatShortDate } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";

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


  const stats = [
    {
      title: t("providerDashboard.stats.livePrograms"),
      value: data.overview.livePrograms,
      subtitle: t("providerDashboard.stats.allPublished"),
      subtitleColor: "text-accentGreen",
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      iconBg: "bg-blue-500/15",
    },
    {
      title: t("providerDashboard.stats.totalEnrolled"),
      value: data.overview.totalEnrollments,
      subtitle: t("providerDashboard.stats.acrossPrograms", {
        count: data.overview.livePrograms,
      }),
      subtitleColor: "text-textSidebarMuted",
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      iconBg: "bg-emerald-500/15",
    },
    {
      title: t("providerDashboard.stats.drafts"),
      value: data.overview.drafts,
      subtitle: t("providerDashboard.stats.awaitingPublish"),
      subtitleColor: "text-accentOrange",
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      iconBg: "bg-amber-500/15",
    },
    {
      title: t("providerDashboard.stats.avgFillRate"),
      value: `${ data.overview.averageFillRate }%`,
      subtitle: t("providerDashboard.stats.capacityUtilized"),
      subtitleColor: "text-accentGreen",
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      iconBg: "bg-green-500/15",
    },
  ];


  const liveProgramColumns = [
    {
      key: "program",
      header: "Program",
      render: (row: DashboardTopProgram) => (
        <span className="text-textSecondary text-sm font-normal pl-6">
          {row.title}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (row: DashboardTopProgram) => (
        <span className="text-textSidebarMuted text-xs">
          {formatShortDate(row.startDate)}
        </span>
      ),
    },
    {
      key: "enrolled",
      header: "Enrolled",
      render: (row: DashboardTopProgram) => (
        <span className="text-textSecondary text-sm text-center">
          {row.enrolledCount} / {row.maxParticipants}
        </span>
      ),
    },
    {
      key: "fill",
      header: "Fill",
      render: (row: DashboardTopProgram) => (
        <div className="flex justify-end">
          <Progress value={row.fillRate} className="h-1.5 w-16 bg-[#1e293b]" />
        </div>
      ),
    },
  ];


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
                <Link href="/employee/programs">
                  View all →
                </Link>
              </Button>
            }
          >
            <DataTable<DashboardTopProgram>
              data={data.topPrograms}
              columns={liveProgramColumns}
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

