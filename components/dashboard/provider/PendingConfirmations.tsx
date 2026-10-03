'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DashboardSectionCard } from '@/components/shared/dashboard-section-card';
import { providerService, PendingTpConfirmation } from '@/services/provider.service';
import { formatDateHyphenated } from '@/utils/formatters';
import ConfirmEnrollmentModal from './ConfirmEnrollmentModal';

const groupByProgram = (rows: PendingTpConfirmation[]) => {
  const groups = new Map<string, { programId: string; programTitle: string; rows: PendingTpConfirmation[] }>();
  for (const row of rows) {
    const group = groups.get(row.programId);
    if (group) {
      group.rows.push(row);
    } else {
      groups.set(row.programId, { programId: row.programId, programTitle: row.programTitle, rows: [row] });
    }
  }
  return Array.from(groups.values());
};

interface PendingConfirmationsProps {
  hideWhenEmpty?: boolean;
}

export function PendingConfirmations({ hideWhenEmpty = true }: PendingConfirmationsProps) {
  const [rows, setRows] = useState<PendingTpConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEntry, setActiveEntry] = useState<PendingTpConfirmation | null>(null);
  const [confirming, setConfirming] = useState(false);

  const fetchPending = async () => {
    try {
      const data = await providerService.getPendingTpConfirmations();
      setRows(data);
    } catch (err) {
      console.error('Failed to fetch pending TP confirmations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleDecline = async (notes: string) => {
    if (!activeEntry) return;
    setConfirming(true);
    try {
      await providerService.declineEnrollment(activeEntry.programId, activeEntry._id, notes || undefined);
      toast.success(
        t('providerDashboard.pendingConfirmations.declineSuccessToast', { name: activeEntry.employeeName })
      );
      setRows((prev) => prev.filter((r) => r._id !== activeEntry._id));
      setActiveEntry(null);
    } catch (err) {
      console.error('Failed to decline enrollment', err);
      toast.error(t('providerDashboard.pendingConfirmations.declineErrorToast'));
    } finally {
      setConfirming(false);
    }
  };

  const handleConfirm = async (notes: string) => {
    if (!activeEntry) return;
    setConfirming(true);
    try {
      await providerService.confirmEnrollment(activeEntry.programId, activeEntry._id, notes || undefined);
      toast.success(
        t('providerDashboard.pendingConfirmations.successToast', { name: activeEntry.employeeName })
      );
      setRows((prev) => prev.filter((r) => r._id !== activeEntry._id));
      setActiveEntry(null);
    } catch (err) {
      console.error('Failed to confirm enrollment', err);
      toast.error(t('providerDashboard.pendingConfirmations.errorToast'));
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <DashboardSectionCard title={t('providerDashboard.pendingConfirmations.title')}>
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </DashboardSectionCard>
    );
  }

  if (rows.length === 0 && hideWhenEmpty) return null;

  const groups = groupByProgram(rows);

  return (
    <>
      <DashboardSectionCard
        title={t('providerDashboard.pendingConfirmations.title')}
        subtitle={t('providerDashboard.pendingConfirmations.subtitle')}
        count={rows.length}
      >
        {rows.length === 0 ? (
          <p className="text-sm text-textSidebarMuted text-center py-8">
            {t('providerDashboard.pendingConfirmations.empty')}
          </p>
        ) : (
        <div className="divide-y divide-borderCard">
          {groups.map((group) => (
            <div key={group.programId} className="px-4 py-3">
              <p className="text-sm font-medium text-white mb-2">{group.programTitle}</p>
              <div className="flex flex-col gap-2">
                {group.rows.map((row) => (
                  <div
                    key={row._id}
                    className="flex items-center justify-between pl-4 border-l-2 border-borderCard"
                  >
                    <div>
                      <p className="text-sm text-textSecondary">{row.employeeName}</p>
                      <p className="text-xs text-textSidebarMuted">
                        {t('providerDashboard.pendingConfirmations.ctdApprovedOn', {
                          date: formatDateHyphenated(row.ctdApprovedAt || undefined),
                        })}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => setActiveEntry(row)}>
                      {t('providerDashboard.pendingConfirmations.confirmButton')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}
      </DashboardSectionCard>

      <ConfirmEnrollmentModal
        entry={activeEntry}
        loading={confirming}
        onConfirm={handleConfirm}
        onDecline={handleDecline}
        onClose={() => setActiveEntry(null)}
      />
    </>
  );
}
