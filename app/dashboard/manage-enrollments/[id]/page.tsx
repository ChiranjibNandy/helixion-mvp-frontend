'use client';

import { useParams, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/navigation';
import ManageEnrollmentsView from '@/components/dashboard/provider/ManageEnrollments/ManageEnrollmentsView';

/**
 * Standalone route for direct/bookmarked links. The primary entry point is
 * now the in-place view on /dashboard/programs/list — see that page.
 */
export default function ManageEnrollmentsPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params?.id as string;

  return (
    <div className="p-6">
      <ManageEnrollmentsView
        programId={programId}
        onBack={() => router.push(ROUTES.PROVIDER.PROGRAMS.LIST)}
      />
    </div>
  );
}
