"use client";

import { USER_ROLES } from "@/constants/navigation";
import EmployeeDashboardView from "./employee/EmployeeDashboardView";
import TrainingProviderDashboardView from "./provider/TrainingProviderDashboardView";


interface RoleDashboardViewProps {
  role: string;
  name: string;
}

export function RoleDashboardView({ role, name }: RoleDashboardViewProps) {
  if (role === USER_ROLES.EMPLOYEE) {
    return <EmployeeDashboardView name={name} />;
  }

  if (role === USER_ROLES.TRAINING_PROVIDER) {
    return <TrainingProviderDashboardView name={name} />;
  }

  return null

}