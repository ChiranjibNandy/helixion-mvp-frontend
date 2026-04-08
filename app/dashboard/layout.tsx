import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import type { User } from '@/types';
import { decodeJwtPayload, getAccessToken } from '@/utils/token';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const token = getAccessToken();
  if (!token) redirect('/signin');

  const payload = decodeJwtPayload(token);

  const user: User = {
    userId: payload.userId,
    name:     payload.name,
    email:    payload.email,
    location: payload.location,
    role:     payload.role,
  };

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}