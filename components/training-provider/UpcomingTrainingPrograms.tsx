
"use client";

import { CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";

import { DashboardSectionCard } from "@/components/shared/dashboard-section-card";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/navigation";

import type { DashboardUpcomingProgram } from "@/services/provider.service";
import { DaysToGoBadge } from "../dashboard/trainingDept/DaysToGoBadge";
import { EnrolmentDonut } from "../dashboard/trainingDept/EnrolmentDonut";
import { UpcomingProgramStatusBadge } from "../dashboard/trainingDept/UpcomingProgramStatusBadge";
import { t } from "@/lib/i18n";


interface UpcomingTrainingProgramsProps {
  programs: DashboardUpcomingProgram[];
}

const formatProgramDate = (date: string) => {
  return {
    day: new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      timeZone: "Asia/Kolkata",
    }),
    month: new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      timeZone: "Asia/Kolkata",
    }),
  };
};

export function UpcomingTrainingPrograms({
  programs
}: UpcomingTrainingProgramsProps) {

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
        <DaysToGoBadge daysToGo={program.daysToGo} />
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
            {t("upcomingPrograms.capacity.min")} {program.minParticipants ?? "-"}
          </span>

          <span className="h-6 w-px bg-borderCard" />

          <span>
            {t("upcomingPrograms.capacity.max")} {program.maxParticipants ?? "-"}
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
    }
  ];

  return (
    <DashboardSectionCard
      title={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2.5">
            <CalendarDays className="size-6 text-primary" />
          </div>

          <div>
            <h2 className="text-white text-lg font-semibold">
              {t("upcomingPrograms.title")}
            </h2>

            <p className="text-textSidebarMuted text-xs mt-1">
              {t("upcomingPrograms.subtitle")}
            </p>
          </div>
        </div>
      }
      action={
        <Button asChild variant="ghost" size="sm">
          <Link href={ROUTES.PROVIDER.PROGRAMS.LIST}>
            {t("upcomingPrograms.viewAll")}
          </Link>
        </Button>
      }
    >
      <DataTable<DashboardUpcomingProgram>
        data={programs}
        columns={columns}
        emptyMessage={t("upcomingPrograms.empty")}
      />
    </DashboardSectionCard>
  );
}
