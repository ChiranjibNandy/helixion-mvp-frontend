'use client';

import { useEffect, useState } from 'react';
import { Ban } from 'lucide-react';
import ModalShell from '../shared/ModalShell';
import { CloseButton, IconBadge, ModalError, WarningBox } from '../shared/ModalPrimitives';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EnrollmentActionEmployee } from './EnrollmentActionEmployee';
import { ENROLLMENT_CANCELLATION_REASONS } from './enrollmentCancellationReasons';
import { EnrollmentCancellationReason } from '@/services/provider.service';
import { formatDate, statusBadgeClass, DisplayStatus } from './utils';

interface CancelEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EnrollmentActionEmployee[];
  /** Only meaningful in single-row mode (image 3 shows a "Current Status" badge) */
  currentStatus?: DisplayStatus;
  onCancel: (reason: EnrollmentCancellationReason, notes?: string) => Promise<void>;
}

export default function CancelEnrollmentModal({
  isOpen,
  onClose,
  employees,
  currentStatus,
  onCancel,
}: CancelEnrollmentModalProps) {
  const [reason, setReason] = useState<EnrollmentCancellationReason>(ENROLLMENT_CANCELLATION_REASONS[0].value);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isBulk = employees.length > 1;
  const single = employees[0];

  useEffect(() => {
    if (!isOpen) return;
    setReason(ENROLLMENT_CANCELLATION_REASONS[0].value);
    setNotes('');
    setError(null);
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleCancel = async () => {
    if (reason === 'other' && notes.trim().length === 0) {
      setError('Please describe the reason for cancellation.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onCancel(reason, notes.trim() || undefined);
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not cancel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onOverlayClose={handleClose} maxWidthClassName={isBulk ? 'max-w-xl' : 'max-w-md'}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <IconBadge tone="red"><Ban size={18} /></IconBadge>
          <h2 className="text-base font-semibold text-gray-900">
            {isBulk ? 'Cancel Selected Enrolments' : 'Cancel Employee Enrolment'}
          </h2>
        </div>
        <CloseButton onClick={handleClose} />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          {isBulk
            ? `Are you sure you want to cancel the enrolments for the ${employees.length} selected employees?`
            : 'Are you sure you want to cancel this enrolment?'}
        </p>

        {isBulk ? (
          <div className="max-h-56 overflow-y-auto">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-auto pb-2 pl-0 pr-2 text-xs text-gray-400">#</TableHead>
                  <TableHead className="h-auto pb-2 pr-2 text-xs text-gray-400">Employee Name</TableHead>
                  <TableHead className="h-auto pb-2 pr-2 text-xs text-gray-400">Company Name</TableHead>
                  <TableHead className="h-auto pb-2 pr-2 text-xs text-gray-400">Designation</TableHead>
                  <TableHead className="h-auto pb-2 pr-0 text-xs text-gray-400">Nomination Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((e, i) => (
                  <TableRow key={e.enrollmentId} className="hover:bg-transparent">
                    <TableCell className="py-1.5 pl-0 pr-2 text-gray-400">{i + 1}</TableCell>
                    <TableCell className="py-1.5 pr-2 text-gray-900 font-medium">{e.name}</TableCell>
                    <TableCell className="py-1.5 pr-2 text-gray-500">{e.company ?? '-'}</TableCell>
                    <TableCell className="py-1.5 pr-2 text-gray-500">{e.designation ?? '-'}</TableCell>
                    <TableCell className="py-1.5 pr-0 text-gray-500">{formatDate(e.nominationDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Employee Name</span>
              <span className="text-gray-900 font-medium">{single?.name}</span>
            </div>
            {single?.company && (
              <div className="flex justify-between">
                <span className="text-gray-500">Company Name</span>
                <span className="text-gray-900 font-medium">{single.company}</span>
              </div>
            )}
            {single?.designation && (
              <div className="flex justify-between">
                <span className="text-gray-500">Designation</span>
                <span className="text-gray-900 font-medium">{single.designation}</span>
              </div>
            )}
            {single?.nominationDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Nomination Date</span>
                <span className="text-gray-900 font-medium">{formatDate(single.nominationDate)}</span>
              </div>
            )}
            {currentStatus && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Current Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusBadgeClass(currentStatus)}`}>
                  {currentStatus}
                </span>
              </div>
            )}
          </div>
        )}

        <div>
          <label htmlFor="enrollment-cancel-reason" className="block text-xs font-medium text-gray-600 mb-1.5">
            Reason for cancellation *
          </label>
          <select
            id="enrollment-cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as EnrollmentCancellationReason)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ENROLLMENT_CANCELLATION_REASONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-gray-900">{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="enrollment-cancel-notes" className="block text-xs font-medium text-gray-600 mb-1.5">
            Additional remarks (optional)
          </label>
          <textarea
            id="enrollment-cancel-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter any additional details..."
          />
        </div>

        <WarningBox
          items={
            isBulk
              ? ['The selected enrolments will be cancelled.', 'All selected employees will be notified.']
              : [
                  'The enrolment will be cancelled.',
                  'The employee will be notified about the cancellation.',
                  'If a welcome letter has been issued, it will be withdrawn.',
                ]
          }
        />

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
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:opacity-70"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isBulk ? `Cancel ${employees.length} Enrolments` : 'Cancel Enrolment'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
