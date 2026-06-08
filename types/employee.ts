import { NavItem } from "@/types";
import { ReactNode } from "react";

/**
 * Represents a navigation section in the employee sidebar
 */
export interface NavSection {
  category: string;// Title of the section (e.g., "Dashboard", "Management")
  items: NavItem[];// List of navigation items under this category
}

export interface DashboardSummary {
  programsCompleted: number;
  programsEnrolled: number;
  pendingApprovals: number;
}

export interface ApprovalStats {
  approved: number;
  pending: number;
  dismissed: number;
  null: number;
}

export interface ListedProgram {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  status: 'Enrolled' | 'Pending' | 'Open' | 'Approved' | 'Rejected';
}

export interface EmployeeDashboardData {
  summary: DashboardSummary;
  approvalStats: ApprovalStats;
  listedPrograms: ListedProgram[];
}

export interface EmployeeDashboardResponse {
  success: boolean;
  message: string;
  data: EmployeeDashboardData;
}



export interface QuickAction {
  title: string;
  description: string;
  linkText: string;
  href: string;
  icon: ReactNode;
  iconBg: string;
}