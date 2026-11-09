import { HelpCircle, AlertTriangle } from 'lucide-react';
import { CloseButton, IconBadge, InfoBox, ModalError } from './ModalPrimitives';

interface ConfirmStepProps {
  belowMinimum: boolean;
  activeEnrollmentCount: number;
  minParticipants?: number;
  maxParticipants?: number;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ConfirmStep({
  belowMinimum,
  activeEnrollmentCount,
  minParticipants,
  maxParticipants,
  loading,
  error,
  onBack,
  onConfirm,
}: ConfirmStepProps) {
  return (
    <>
      <div className="flex justify-end mb-1">
        <CloseButton onClick={onBack} />
      </div>

      <div className="space-y-4 -mt-4">
        <IconBadge tone={belowMinimum ? 'blue' : 'red'}>
          {belowMinimum ? <HelpCircle size={24} /> : <AlertTriangle size={24} />}
        </IconBadge>

        <h2 className={`text-lg font-semibold ${belowMinimum ? 'text-gray-900' : 'text-red-600'}`}>
          {belowMinimum ? 'Cancel this training program?' : 'Are you sure you want to cancel this training program?'}
        </h2>

        {belowMinimum ? (
          <div className="space-y-2">
            <InfoBox>
              <p className="text-sm text-gray-700 leading-relaxed">
                This program has only {activeEnrollmentCount} enrolment{activeEnrollmentCount === 1 ? '' : 's'} (minimum required is {minParticipants ?? '—'}).
              </p>
            </InfoBox>
            <InfoBox>
              <p className="text-sm text-gray-700 leading-relaxed">
                All registered employees will be notified and confirmed enrolments will be cancelled.
              </p>
            </InfoBox>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 leading-relaxed">
              This program has {activeEnrollmentCount} enrolments (maximum capacity is {maxParticipants ?? '—'}). Cancellation will affect confirmed and pending enrolments.
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex gap-2"><span className="text-red-500">•</span> All registered employees will be notified about the cancellation.</li>
              <li className="flex gap-2"><span className="text-red-500">•</span> All confirmed and pending enrolments will be cancelled.</li>
              <li className="flex gap-2"><span className="text-red-500">•</span> This action cannot be undone.</li>
            </ul>
          </div>
        )}

        <ModalError message={error} />

        <div className="flex justify-end gap-3 pt-1">
          <button
            disabled={loading}
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:opacity-70"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Yes, Cancel Program
          </button>
        </div>
      </div>
    </>
  );
}
