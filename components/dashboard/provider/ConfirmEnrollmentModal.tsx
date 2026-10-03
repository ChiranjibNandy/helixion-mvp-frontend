'use client';

import { useEffect, useState } from 'react';
import AppModal from '@/components/ui/app-modal';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import type { PendingTpConfirmation } from '@/services/provider.service';

interface ConfirmEnrollmentModalProps {
  entry: PendingTpConfirmation | null;
  loading: boolean;
  onConfirm: (notes: string) => void;
  onDecline: (notes: string) => void;
  onClose: () => void;
}

export default function ConfirmEnrollmentModal({
  entry,
  loading,
  onConfirm,
  onDecline,
  onClose,
}: ConfirmEnrollmentModalProps) {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setNotes('');
  }, [entry?._id]);

  const handleClose = () => {
    if (loading) return;
    setNotes('');
    onClose();
  };

  return (
    <AppModal isOpen={!!entry} title={t('providerDashboard.pendingConfirmations.modalTitle')} onClose={handleClose}>
      {entry && (
        <>
          <p className="text-sm text-white/60 mb-4">
            {t('providerDashboard.pendingConfirmations.modalDescription', {
              name: entry.employeeName,
              program: entry.programTitle,
            })}
          </p>

          <label className="block text-xs font-semibold tracking-widest uppercase text-textMuted mb-1.5">
            {t('providerDashboard.pendingConfirmations.notesLabel')}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('providerDashboard.pendingConfirmations.notesPlaceholder')}
            rows={3}
            maxLength={500}
            disabled={loading}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 resize-none"
          />

          <div className="flex justify-end gap-3 mt-5">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              {t('button.cancel')}
            </Button>
            <Button variant="outline" onClick={() => onDecline(notes)} disabled={loading}>
              {t('providerDashboard.pendingConfirmations.declineCta')}
            </Button>
            <Button onClick={() => onConfirm(notes)} disabled={loading} className="flex items-center gap-2">
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {t('providerDashboard.pendingConfirmations.confirmCta')}
            </Button>
          </div>
        </>
      )}
    </AppModal>
  );
}
