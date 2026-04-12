"use client";

import { useEffect, useState } from "react";
import { MyEnrollments } from "./MyEnrollments";
import { AvailableProgrammes } from "./AvailableProgrammes";
import { fetchEmployeeDashboardData } from "@/utils/employeeService";
import { AppAlert } from "../ui/alert";


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
        title="Error"
        description="Unable to load your dashboard. Please try refreshing the page."
      />
    );
  }

  if (!data) {
    return <p className="text-xs text-muted-foreground">Loading...</p>;
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