'use client';

import PageHeader from '@/components/ui/pageHeader';
import { PendingConfirmations } from '@/components/dashboard/provider/PendingConfirmations';
import { t } from '@/lib/i18n';

export default function PendingConfirmationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title={t('providerDashboard.pendingConfirmations.pageTitle')} />
      <PendingConfirmations hideWhenEmpty={false} />
    </div>
  );
}
