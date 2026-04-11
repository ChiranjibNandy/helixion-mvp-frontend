"use client";

import { useEffect, useState } from "react";
import { MyEnrollments } from "./MyEnrollments";
import { AvailableProgrammes } from "./AvailableProgrammes";
import { fetchEmployeeDashboardData } from "@/utils/employeeService";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/Alert";

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
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Unable to load your dashboard. Please try refreshing the page.
        </AlertDescription>
      </Alert>
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