import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import type { User } from '@/types';
import { decodeJwtPayload, getAccessToken } from '@/utils/token';
import { redirect } from 'next/navigation';
import { EMP_NAV_SECTIONS } from '@/constants/employee';
import { PROVIDER_NAV_SECTIONS } from '@/constants/provider';
import { USER_ROLES } from '@/constants/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const token = await getAccessToken();
  if (!token) redirect('/signin');

  const payload = await decodeJwtPayload(token);

  const user: User = {
    userId: payload.userId,
    name: payload.name,
    email: payload.email,
    location: payload.location,
    role: payload.orgRole,
    permissions: payload.permissions
  };

  // Choose navigation based on user role
  const isProvider = payload.orgRole === USER_ROLES.TRAINING_PROVIDER;
  const baseSections = isProvider
    ? PROVIDER_NAV_SECTIONS
    : EMP_NAV_SECTIONS;

  // Hide Approval menu if user cannot recommend
  const navSections = baseSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (item.key === 'approvals') {
        return user.permissions.canRecommend;
      }
      return true;
    }),
  }));

  const defaultActiveKey = 'dashboard';

  return (
    <DashboardShell
      user={user}
      navSections={navSections}
      defaultActiveKey={defaultActiveKey}
    >
      {children}
    </DashboardShell>
  );
}
