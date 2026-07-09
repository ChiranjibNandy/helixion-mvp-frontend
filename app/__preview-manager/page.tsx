import { notFound } from 'next/navigation';
import { DashboardShell } from '@/components/DashboardShell';
import { MANAGER_NAV_SECTIONS } from '@/constants/manager';
import ManagerDashboardView from '@/components/dashboard/manager/ManagerDashboardView';

export default function PreviewManagerDashboardPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  const user = {
    userId: 'preview',
    name: 'Rahul Kapoor',
    email: 'rahul.kapoor@example.com',
    location: 'General Accounts',
    role: 'manager',
    permissions: {
      canEnroll: true,
      canRecommend: true,
      canApproveEnrollment: true,
      canReviewTrainingDept: false,
      canApproveTrainingDept: false,
      canReviewOsd: false,
      canApproveOsd: false,
    },
  };

  return (
    <DashboardShell user={user} navSections={MANAGER_NAV_SECTIONS} defaultActiveKey="dashboard">
      <ManagerDashboardView name={user.name} />
    </DashboardShell>
  );
}
