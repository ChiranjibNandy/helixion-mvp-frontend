import { ApprovalStats, DashboardSummary } from './employee';

export interface TrainingDeptDashboardSummary extends DashboardSummary {
  pendingTourApprovals: number;
}

export interface PendingReviewRow {
  _id: string;
  employeeName: string;
  programTitle: string;
  fromDate: string;
  toDate: string;
  venue: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
}

export interface TrainingDeptDashboardData {
  summary: TrainingDeptDashboardSummary;
  approvalStats: ApprovalStats;
  pendingReviews: PendingReviewRow[];
}
