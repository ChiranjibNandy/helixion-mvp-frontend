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
  };

  return (
    <DashboardShell user={user} navSections={MANAGER_NAV_SECTIONS} defaultActiveKey="dashboard">
      <ManagerDashboardView name={user.name} />
    </DashboardShell>
  );
}
