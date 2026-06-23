import { ApprovalStats, DashboardSummary } from './employee';

export interface ManagerDashboardSummary extends DashboardSummary {
  teamEnrollments: number;
}

export interface TeamEnrollmentRow {
  _id: string;
  employeeName: string;
  programTitle: string;
  fromDate: string;
  toDate: string;
  venue: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
}

export interface ManagerDashboardData {
  summary: ManagerDashboardSummary;
  approvalStats: ApprovalStats;
  pendingTeamEnrollments: TeamEnrollmentRow[];
}
