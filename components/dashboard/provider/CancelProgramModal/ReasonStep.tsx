import { Trash2 } from 'lucide-react';
import { ProgramCancellationReason } from '@/services/provider.service';
import { CloseButton, IconBadge, InfoBox, ModalError } from './ModalPrimitives';
import { ReasonOption } from './reasons';

interface ReasonStepProps {
  belowMinimum: boolean;
  activeEnrollmentCount: number;
  minParticipants?: number;
  maxParticipants?: number;
  reasonOptions: ReasonOption[];
  reason: ProgramCancellationReason;
  note: string;
  error: string | null;
  onReasonChange: (value: ProgramCancellationReason) => void;
  onNoteChange: (value: string) => void;
  onClose: () => void;
  onProceed: () => void;
}

export default function ReasonStep({
  belowMinimum,
  activeEnrollmentCount,
  minParticipants,
  maxParticipants,
  reasonOptions,
  reason,
  note,
  error,
  onReasonChange,
  onNoteChange,
  onClose,
  onProceed,
}: ReasonStepProps) {
  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <IconBadge tone="red"><Trash2 size={18} /></IconBadge>
          <h2 className="text-base font-semibold text-gray-900">Cancel Training Program</h2>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      <div className="space-y-4">
        <InfoBox>
          <p className="text-sm text-gray-700 leading-relaxed">
            {belowMinimum
              ? `This program has only ${activeEnrollmentCount} enrolment${activeEnrollmentCount === 1 ? '' : 's'}, which is below the minimum required (${minParticipants ?? '—'}).`
              : `This program is currently over enrolled (${activeEnrollmentCount} / ${maxParticipants ?? '—'}).`}
          </p>
          <p className="text-xs text-gray-500 mt-1.5">
            All registered employees will be notified about the cancellation and confirmed enrolments will be cancelled.
          </p>
        </InfoBox>

        <div>
          <label htmlFor="cancel-reason" className="block text-xs font-medium text-gray-600 mb-1.5">
            Reason for cancellation *
          </label>
          <select
            id="cancel-reason"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value as ProgramCancellationReason)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {reasonOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {reason === 'other' && (
          <div>
            <label htmlFor="cancel-note" className="block text-xs font-medium text-gray-600 mb-1.5">
              Describe the reason *
            </label>
            <textarea
              id="cancel-note"
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Describe the reason for cancellation"
            />
          </div>
        )}

        <ModalError message={error} />

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Keep Program
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500"
          >
            Cancel Program
          </button>
        </div>
      </div>
    </>
  );
}
