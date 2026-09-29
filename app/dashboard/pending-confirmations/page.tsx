'use client';

import PageHeader from '@/components/ui/pageHeader';
import { PendingConfirmations } from '@/components/dashboard/provider/PendingConfirmations';

export default function PendingConfirmationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pending Confirmations" />
      <PendingConfirmations hideWhenEmpty={false} />
    </div>
  );
}
