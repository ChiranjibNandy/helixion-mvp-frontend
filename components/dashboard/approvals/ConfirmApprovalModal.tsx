'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppAlert } from '@/components/shared/app-alert';
import { EnrollmentApproval } from '@/types/enrollment';

interface Props {
  isOpen: boolean;
  row: EnrollmentApproval | null;
  loading?: boolean;
  error?: string | null;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
}

export default function ConfirmApprovalModal({
  isOpen,
  row,
  loading = false,
  error,
  onApprove,
  onReject,
  onCancel,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen || !row) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onCancel();
  };

  const employeeName = row.employeeId?.name ?? 'this employee';
  const programTitle = row.programId?.title ?? 'this program';
  const venue = row.programId?.venueName || row.programId?.city;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#1a1b25] border border-white/10 shadow-2xl p-7 animate-in fade-in zoom-in-95 text-center">

        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 mx-auto border bg-amber-500/10 text-amber-400 border-amber-500/20">
          <AlertTriangle size={22} />
        </div>

        <h2 className="text-lg font-semibold text-white mb-2">
          Confirm Approval
        </h2>

        <p className="text-sm text-white/50 leading-relaxed mb-4">
          Are you sure you want to approve the Training Enrolment for{' '}
          <span className="text-white/80">{employeeName}</span> for{' '}
          <span className="text-white/80">{programTitle}</span> and approve the
          associated Tour Form? This action cannot be undone.
        </p>

        <div className="rounded-xl bg-black/20 border border-white/10 p-4 mb-6 text-left text-sm space-y-2">
          <div className="flex justify-between gap-4">
            <span className="text-white/50">Employee:</span>
            <span className="text-white font-medium text-right">{employeeName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/50">Program:</span>
            <span className="text-white font-medium text-right">
              {programTitle}{venue ? ` / ${venue}` : ''}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-left">
            <AppAlert variant="destructive" description={error} />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="destructive"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={onReject}
            disabled={loading}
          >
            <X size={16} />
            Reject
          </Button>

          <Button
            className="flex-1 flex items-center justify-center gap-2"
            onClick={onApprove}
            disabled={loading}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Approve
          </Button>
        </div>

        <button
          type="button"
          className="mt-4 text-sm text-white/40 hover:text-white/70 transition-colors"
          onClick={onCancel}
          disabled={loading}
        >
          No, Go Back
        </button>
      </div>
    </div>
  );
}
