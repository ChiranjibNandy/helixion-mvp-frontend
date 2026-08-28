"use client";

import { USER_ROLES } from "@/constants/navigation";
import EmployeeDashboardView from "./employee/EmployeeDashboardView";
import TrainingProviderDashboardView from "./provider/TrainingProviderDashboardView";
import ManagerDashboardView from "./manager/ManagerDashboardView";
import CtdDashboardView from "./trainingDept/CtdDashboardView";


interface RoleDashboardViewProps {
  role: string;
  name: string;
  /** officeRoles.trainingDept.enabled — a CTD sees their own review-queue
   * dashboard regardless of orgRole/canRecommend below (an office role is
   * independent of, and takes precedence over, the manager/employee split). */
  isCtd?: boolean;
  /** permissions.canRecommend — true iff this user appears anywhere in
   * another user's hierarchy.managerChain (see hasReportingEmployees in
   * user.repository.ts), i.e. they actually manage at least one person.
   * This replaced a hierarchyLevel-based check that was checking the wrong
   * thing: hierarchy.level is this user's OWN depth from the org root (how
   * many managers are above them), not whether anyone reports to them — so
   * it was true for almost every non-root employee, routing nearly the
   * entire workforce (including CTD/OSD officers, who have no team at all)
   * to the Manager dashboard instead of their own. */
  canRecommend?: boolean;
}

export function RoleDashboardView({ role, name, isCtd, canRecommend }: RoleDashboardViewProps) {
  if (role === USER_ROLES.TRAINING_PROVIDER) {
    return <TrainingProviderDashboardView name={name} />;
  }

  if (isCtd) {
    return <CtdDashboardView name={name} />;
  }

  // A small number of legacy accounts still have orgRole literally set to
  // "manager" (pre-migration data) — keep matching that too so those
  // accounts don't regress.
  if (role === USER_ROLES.MANAGER || canRecommend) {
    return <ManagerDashboardView name={name} />;
  }

  if (role === USER_ROLES.EMPLOYEE) {
    return <EmployeeDashboardView name={name} />;
  }

  return null;

}