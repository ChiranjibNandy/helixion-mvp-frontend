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
    role: payload.role,
  };

  // Choose navigation based on user role
  const isProvider = payload.role === USER_ROLES.TRAINING_PROVIDER;
  const navSections = isProvider ? PROVIDER_NAV_SECTIONS : EMP_NAV_SECTIONS;
  const defaultActiveKey =  'dashboard';

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
