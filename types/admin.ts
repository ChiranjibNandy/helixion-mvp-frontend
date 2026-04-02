// Core domain types for admin dashboard

export interface UserRegistration {
  id: string;
  username: string;
  email: string;
  approval_status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}

export interface FormattedRegistration {
  id: string;
  name: string;
  email: string;
  date: string;
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  type: ActivityType;
}

export type ActivityType = 'success' | 'error' | 'warning' | 'info';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalUsers: number;
  pendingApproval: number;
  activeToday: number;
  deactivated: number;
}

export interface SidebarProps {
  pendingCount: number;
  totalUsers: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  subtitleColor?: string;
}

export interface ActivityItemProps {
  title: string;
  time: string;
  dotColor: string;
}

export interface RegistrationRowProps {
  name: string;
  email: string;
  date: string;
  icon: string;
  iconBg: string;
}

export interface RecentActivityProps {
  activities: Activity[];
}

export interface PendingRegistrationsProps {
  registrations: FormattedRegistration[];
}

export interface EmptySectionProps {
  title: string;
  subtitle: string;
}
