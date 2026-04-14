import { RoleDashboardView } from '@/components/dashboard/RoleDashboardView';
import { decodeJwtPayload, getAccessToken } from '@/utils/token';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const token = getAccessToken();
  if (!token) redirect('/signin');

  const { role } = decodeJwtPayload(token);

  return <RoleDashboardView role={role}  />;
}