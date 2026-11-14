
"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/shared/data-table";
import type { DashboardUpcomingProgram } from "@/services/provider.service";
import { t } from "@/lib/i18n";
import { DaysToGoBadge } from "./DaysToGoBadge";
import { EnrolmentDonut } from "./EnrolmentDonut";
import { UpcomingProgramStatusBadge } from "./UpcomingProgramStatusBadge";
import { ROUTES } from "@/constants/navigation";

interface UpcomingProgramsTableProps {
  programs: DashboardUpcomingProgram[];
}

const formatProgramDate = (date: string) => {
  const parsedDate = new Date(date);

  return {
    day: parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      timeZone: "Asia/Kolkata",
    }),
    month: parsedDate.toLocaleDateString("en-IN", {
      month: "short",
      timeZone: "Asia/Kolkata",
    }),
  };
};

export function UpcomingProgramsTable({
  programs,
}: UpcomingProgramsTableProps) {

  const router = useRouter();

  const handleRowClick = (program: DashboardUpcomingProgram) => {
    router.push(ROUTES.PROVIDER.PROGRAMS.VIEW(program._id));
  };



  const columns = [
    {
      key: "date",
      header: t("upcomingPrograms.columns.date"),
      className: "w-[100px]",
      render: (program: DashboardUpcomingProgram) => {
        const date = formatProgramDate(program.startDate);

        return (
          <div className="flex flex-col items-center justify-center rounded-lg bg-bgStatCard px-3 py-2 w-[70px]">
            <span className="text-xl font-bold text-white">
              {date.day}
            </span>

            <span className="text-xs uppercase text-textSidebarMuted">
              {date.month}
            </span>
          </div>
        );
      },
    },
    {
      key: "daysToGo",
      header: t("upcomingPrograms.columns.daysToGo"),
      className: "w-[110px]",
      render: (program: DashboardUpcomingProgram) => (
        <DaysToGoBadge
          daysToGo={program.daysToGo}
          status={program.programStatus}
        />
      ),
    },
    {
      key: "program",
      header: t("upcomingPrograms.columns.program"),
      className: "min-w-[220px]",
      render: (program: DashboardUpcomingProgram) => (
        <span className="font-semibold text-white text-sm">
          {program.title}
        </span>
      ),
    },
    {
      key: "enrollments",
      header: t("upcomingPrograms.columns.enrollments"),
      className: "text-center w-[130px]",
      render: (program: DashboardUpcomingProgram) => (
        <EnrolmentDonut
          enrolledCount={program.enrolledCount}
          maxParticipants={program.maxParticipants}
          fillRate={program.fillRate}
          status={program.programStatus}
        />
      ),
    },
    {
      key: "capacity",
      header: t("upcomingPrograms.columns.capacity"),
      className: "min-w-[180px]",
      render: (program: DashboardUpcomingProgram) => (
        <div className="flex items-center gap-4 text-sm text-textSidebarMuted whitespace-nowrap">
          <span>
            {t("upcomingPrograms.capacity.min")}{" "}
            {program.minParticipants ?? "-"}
          </span>

          <span className="h-6 w-px bg-borderCard" />

          <span>
            {t("upcomingPrograms.capacity.max")}{" "}
            {program.maxParticipants ?? "-"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[210px]",
      render: (program: DashboardUpcomingProgram) => (
        <UpcomingProgramStatusBadge
          status={program.programStatus}
        />
      ),
    },
  ];

  return (
    <DataTable<DashboardUpcomingProgram>
      data={programs}
      columns={columns}
      emptyMessage={t("upcomingPrograms.empty")}
      onRowClick={handleRowClick}
    />
  );
}