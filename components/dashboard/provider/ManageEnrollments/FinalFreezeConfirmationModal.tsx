
'use client';

import { LockKeyhole, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

interface FinalFreezeConfirmationModalProps {
  isOpen: boolean;
  programTitle: string;
  loading?: boolean;
  onGoBack: () => void;
  onConfirm: () => void;
}

export default function FinalFreezeConfirmationModal({
  isOpen,
  programTitle,
  loading = false,
  onGoBack,
  onConfirm,
}: FinalFreezeConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onGoBack();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="final-freeze-title"
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <LockKeyhole size={22} />
            </div>

            <h2
              id="final-freeze-title"
              className="text-base font-bold text-gray-900"
            >
              {t('programme.finalFreezeConfirmation.title')}
            </h2>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onGoBack}
            aria-label="Close modal"
            className="text-gray-400 transition hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="mb-3 text-sm leading-relaxed text-gray-700">
          {t('programme.finalFreezeConfirmation.description')}
          <span className="font-semibold text-gray-900">
            {' '}"{programTitle}".
          </span>
        </p>

        {/* Warning */}
        <div className="mb-4 flex gap-2 rounded-lg border border-red-100 bg-red-50 p-3">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <p className="text-xs leading-relaxed text-red-700">
            {t('programme.finalFreezeConfirmation.warning')}
          </p>
        </div>

        <p className="mb-5 text-sm text-gray-700">
          {t('programme.finalFreezeConfirmation.proceedQuestion')}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={loading}
            onClick={onGoBack}
            className="flex-1 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('programme.finalFreezeConfirmation.goBack')}
          </Button>

          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {t('programme.finalFreezeConfirmation.processing')}
              </>
            ) : (
              <>
                <LockKeyhole size={15} className="mr-1.5" />
                {t('programme.finalFreezeConfirmation.confirm')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
