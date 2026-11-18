'use client';

import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import ModalShell from '../shared/ModalShell';
import { CloseButton, ModalError, WarningBox } from '../shared/ModalPrimitives';

interface FreezeEnrollmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function FreezeEnrollmentsModal({ isOpen, onClose, onConfirm }: FreezeEnrollmentsModalProps) {
  const [understood, setUnderstood] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setUnderstood(false);
    setError(null);
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not close and freeze enrolments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onOverlayClose={handleClose}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
            <Lock size={18} />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Close &amp; Freeze Enrolments</h2>
        </div>
        <CloseButton onClick={handleClose} />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Are you sure you want to close and freeze enrolments for this program?
        </p>

        <WarningBox
          items={[
            'No further enrolments will be allowed.',
            'Existing enrolments cannot be changed (confirmed, cancelled or modified).',
            'This action cannot be undone.',
          ]}
        />

        <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            className="mt-0.5"
          />
          I understand that this action is final.
        </label>

        <ModalError message={error} />

        <div className="flex justify-end gap-3 pt-1">
          <button
            disabled={loading}
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !understood}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-500 disabled:opacity-50"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Close &amp; Freeze Enrolments
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
