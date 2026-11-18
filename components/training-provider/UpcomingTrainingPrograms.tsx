
"use client";

import { CalendarDays } from "lucide-react";
import Link from "next/link";

import { DashboardSectionCard } from "@/components/shared/dashboard-section-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/navigation";
import type { DashboardUpcomingProgram } from "@/services/provider.service";
import { t } from "@/lib/i18n";
import { UpcomingProgramsTable } from "../dashboard/trainingDept/UpcomingProgramsTable";

interface UpcomingTrainingProgramsProps {
  programs: DashboardUpcomingProgram[];
}

export function UpcomingTrainingPrograms({
  programs,
}: UpcomingTrainingProgramsProps) {
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
          <Link href={ROUTES.PROVIDER.PROGRAMS.UPCOMING}>
            {t("upcomingPrograms.viewAll")}
          </Link>
        </Button>
      }
    >
      <UpcomingProgramsTable programs={programs} />
    </DashboardSectionCard>
  );
}