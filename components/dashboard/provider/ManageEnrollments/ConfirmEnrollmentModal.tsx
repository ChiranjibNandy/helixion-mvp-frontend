'use client';

import { useState } from 'react';
import { CheckCircle2, User } from 'lucide-react';
import ModalShell from '../shared/ModalShell';
import { CloseButton, IconBadge, InfoBox, ModalError } from '../shared/ModalPrimitives';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EnrollmentActionEmployee } from './EnrollmentActionEmployee';
import { formatDate } from './utils';

interface ConfirmEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EnrollmentActionEmployee[];
  onConfirm: () => Promise<void>;
}

export default function ConfirmEnrollmentModal({ isOpen, onClose, employees, onConfirm }: ConfirmEnrollmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isBulk = employees.length > 1;
  const single = employees[0];

  const handleClose = () => {
    if (loading) return;
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not confirm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onOverlayClose={handleClose} maxWidthClassName={isBulk ? 'max-w-xl' : 'max-w-md'}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <IconBadge tone={isBulk ? 'green' : 'slate'}>
            {isBulk ? <CheckCircle2 size={18} /> : <User size={18} />}
          </IconBadge>
          <h2 className="text-base font-semibold text-gray-900">
            {isBulk ? 'Confirm Selected Enrolments' : 'Confirm Employee Enrolment'}
          </h2>
        </div>
        <CloseButton onClick={handleClose} />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          {isBulk
            ? `Are you sure you want to confirm the enrolments for the ${employees.length} selected employees?`
            : 'Are you sure you want to confirm this enrolment?'}
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
          </div>
        )}

        <InfoBox>
          <p className="text-sm text-gray-700 leading-relaxed">
            {isBulk
              ? 'Confirmation emails will be sent to all selected employees. The nominations will be finalised.'
              : 'A confirmation email will be sent to the employee and the nomination will be finalised.'}
          </p>
        </InfoBox>

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
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-70"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isBulk ? `Confirm ${employees.length} Enrolments` : 'Confirm Enrolment'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
