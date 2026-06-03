import { ApprovalStatusCard } from "./ApprovalStatusCard";
import { BarChart2, Bell, BookOpen, CheckCircle, ClipboardCheck, Clock, Link, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchEmployeeDashboardData } from "@/services/employeeService";
import { AppAlert } from "@/components/shared/app-alert";
import { Spinner } from "@/components/ui/spinner";
import { t } from "@/lib/i18n";
import { DashboardStats } from "@/components/shared/dashboard-stats";
import { DashboardSectionCard } from "@/components/shared/dashboard-section-card";
import { DataTable } from "@/components/shared/data-table";
import { formatDateRange } from "@/utils/formatters";
import { StatusBadge } from "../../shared/StatusBadge";
import { QuickActionCard } from "../provider/QuickActionCard";

export default function EmployeeDashboardView({ name }: { name: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await fetchEmployeeDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  interface ListedProgram {
    _id: string;
    title: string;
    description?: string;

    startDate: string;
    endDate: string;

    venue: string;

    status: string;

  }

  const stats = [
    {
      title: t('employeeDashboard.stats.programsCompleted'),
      value: data.summary.programsCompleted,
      subtitle: t('employeeDashboard.stats.completedSubtitle'),
      subtitleColor: 'text-emerald-400',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      iconBg: 'bg-emerald-500/15',
    },
    {
      title: t('employeeDashboard.stats.programsEnrolled'),
      value: data.summary.programsEnrolled,
      subtitle: t('employeeDashboard.stats.enrolledInProgress', {
        count: Math.min(data.summary.programsEnrolled, 2),
      }),
      subtitleColor: 'text-textSidebarMuted',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      iconBg: 'bg-blue-500/15',
    },
    {
      title: t('employeeDashboard.stats.pendingApprovals'),
      value: data.summary.pendingApprovals,
      subtitle: t('employeeDashboard.stats.pendingSubtitle'),
      subtitleColor: 'text-textSidebarMuted',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-amber-500/15',
    },
  ];
  const columns = [
    {
      key: 'title',
      header: t('table.programTitle'),
      render: (program: ListedProgram) => program.title,
    },
    {
      key: 'dates',
      header: t('table.dates'),
      render: (program: ListedProgram) =>
        formatDateRange(program.startDate, program.endDate),
    },
    {
      key: 'venue',
      header: t('table.venue'),
      render: (program: ListedProgram) => program.venue,
    },
    {
      key: 'status',
      header: t('table.status'),
      render: (program: ListedProgram) => (
        <StatusBadge status={program.status} />
      ),
    },
  ];

  interface QuickAction {
    title: string;
    description: string;
    linkText: string;
    href: string;
    icon: React.ReactNode;
    iconBg: string;
  }

  const QUICK_ACTIONS: QuickAction[] = [
    {
      title: t('employeeDashboard.quickActions.enroll.title'),
      description: t('employeeDashboard.quickActions.enroll.description'),
      linkText: t('employeeDashboard.quickActions.enroll.link'),
      href: '/employee/programs',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      iconBg: 'bg-blue-500/15',
    },
    {
      title: t('employeeDashboard.quickActions.approvals.title'),
      description: t('employeeDashboard.quickActions.approvals.description'),
      linkText: t('employeeDashboard.quickActions.approvals.link'),
      href: '/employee/approvals',
      icon: <ClipboardCheck className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-amber-500/15',
    },
    {
      title: t('employeeDashboard.quickActions.reports.title'),
      description: t('employeeDashboard.quickActions.reports.description'),
      linkText: t('employeeDashboard.quickActions.reports.link'),
      href: '/employee/reports',
      icon: <BarChart2 className="w-5 h-5 text-purple-400" />,
      iconBg: 'bg-purple-500/15',
    },
    {
      title: t('employeeDashboard.quickActions.profile.title'),
      description: t('employeeDashboard.quickActions.profile.description'),
      linkText: t('employeeDashboard.quickActions.profile.link'),
      href: '/employee/profile',
      icon: <User className="w-5 h-5 text-slate-400" />,
      iconBg: 'bg-slate-500/15',
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-textSidebarMuted text-xs mb-0.5">
              {t('dashboard.employeeBreadcrump')}
            </p>
            <h1 className="text-white text-2xl font-bold">{t('dashboard.welcome', { name })}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-textSecondary hover:text-white"
            >
              <Bell className="w-5 h-5" />
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5"
            >
              <Link href="/employee/programs">
                <Plus className="w-4 h-4" />
                {t('dashboard.enroll')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary stat cards */}
        <DashboardStats
          stats={stats}
          columns="grid-cols-1 sm:grid-cols-3"
        />

        {/* Programs table + Approval status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Table takes 2/3 */}
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
                columns={columns}
                emptyMessage={t('table.noPrograms')}
              />
            </DashboardSectionCard>

          </div>
          {/* Donut takes 1/3 */}
          <div>
            <ApprovalStatusCard stats={data.approvalStats} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          {QUICK_ACTIONS.map((action) => (
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
    </>
  );
}