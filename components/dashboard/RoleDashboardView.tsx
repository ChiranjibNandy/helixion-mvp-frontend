"use client";

import { useEffect, useState } from "react";
import { MyEnrollments } from "./MyEnrollments";
import { AvailableProgrammes } from "./AvailableProgrammes";
import { fetchEmployeeDashboardData } from "@/utils/employeeService";
import { AppAlert } from "../ui/alert";
import { t } from "@/lib/i18n";

function EmployeeDashboardView() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchEmployeeDashboardData()
      .then(setData)
      .catch(() => setError(true));
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
      <p className="text-xs text-muted-foreground">
        {t('common.loading')}
      </p>
    );
  }

  return (
    <>
      <MyEnrollments enrollments={data.enrollments} />
      <AvailableProgrammes programmes={data.availablePrograms} />
    </>
  );
}

interface RoleDashboardViewProps {
  role: string;
}

export function RoleDashboardView({ role }: RoleDashboardViewProps) {
  switch (role) {
    case "manager":
    case "employee":
      return <EmployeeDashboardView />;
    default:
      return null;
  }
}