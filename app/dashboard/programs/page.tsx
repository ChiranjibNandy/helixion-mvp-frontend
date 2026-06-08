import { redirect } from 'next/navigation';
import { getAccessToken, decodeJwtPayload } from '@/utils/token';
import { USER_ROLES } from '@/constants/navigation';
import { ProgramsListPage } from '@/components/dashboard/employee/ProgramsListPage';

// Training providers use /dashboard/programs/drafts and /dashboard/programs/create
// This route is reserved for the employee program browsing experience
export default async function ProgramsPage() {
  const token = await getAccessToken();
  if (!token) redirect('/signin');

  const payload = await decodeJwtPayload(token);

  if (payload.role === USER_ROLES.TRAINING_PROVIDER) {
    redirect('/dashboard/programs/drafts');
  }

  return <ProgramsListPage />;
}
