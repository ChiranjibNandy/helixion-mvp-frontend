import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import type { User } from '@/types';
import { decodeJwtPayload, getAccessToken } from '@/utils/token';
import { redirect } from 'next/navigation';
import { ADMIN_NAV_SECTION } from '@/constants/admin';
import { ROUTES } from '@/constants/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: DashboardLayoutProps) {
  const token = await getAccessToken();
  if (!token) redirect(ROUTES.SIGNIN);

  const payload = await decodeJwtPayload(token);

  const user: User = {
    userId: payload.userId,
    name: payload.name,
    email: payload.email,
    location: payload.location,
    role: payload.role,
  };

  return (
    <DashboardShell
      user={user}
      navSections={ADMIN_NAV_SECTION}
      defaultActiveKey="dashboard"
    >
      {children}
    </DashboardShell>
  );
}