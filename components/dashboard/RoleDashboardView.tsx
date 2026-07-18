"use client";

import { USER_ROLES } from "@/constants/navigation";
import EmployeeDashboardView from "./employee/EmployeeDashboardView";
import TrainingProviderDashboardView from "./provider/TrainingProviderDashboardView";
import ManagerDashboardView from "./manager/ManagerDashboardView";


interface RoleDashboardViewProps {
  role: string;
  name: string;
  hierarchyLevel?: number;
}

export function RoleDashboardView({ role, name, hierarchyLevel }: RoleDashboardViewProps) {
  if (role === USER_ROLES.TRAINING_PROVIDER) {
    return <TrainingProviderDashboardView name={name} />;
  }

  // There's no distinct orgRole for "manager" — a manager is an
  // orgRole: employee whose hierarchy.level (embedded in the JWT as
  // hierarchyLevel) is > 0, meaning they have at least one direct report.
  // A small number of legacy accounts still have orgRole literally set to
  // "manager" (pre-migration data) — keep matching that too so those
  // accounts don't regress.
  if (role === USER_ROLES.MANAGER || (role === USER_ROLES.EMPLOYEE && (hierarchyLevel ?? 0) > 0)) {
    return <ManagerDashboardView name={name} />;
  }

  if (role === USER_ROLES.EMPLOYEE) {
    return <EmployeeDashboardView name={name} />;
  }

  return null;

}