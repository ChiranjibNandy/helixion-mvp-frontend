import { HelpCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { CloseButton, IconBadge, InfoBox, ModalError, WarningBox } from '../shared/ModalPrimitives';

interface ConfirmStepProps {
  belowMinimum: boolean;
  overEnrolled: boolean;
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
  overEnrolled,
  activeEnrollmentCount,
  minParticipants,
  maxParticipants,
  loading,
  error,
  onBack,
  onConfirm,
}: ConfirmStepProps) {
  const tone = belowMinimum ? 'blue' : 'red';
  const Icon = belowMinimum ? HelpCircle : overEnrolled ? AlertTriangle : Trash2;

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <IconBadge tone={tone}>
            <Icon size={18} />
          </IconBadge>
          <h2 className="text-base font-semibold text-gray-900">
            {belowMinimum ? 'Cancel this training program?' : 'Are you sure you want to cancel this training program?'}
          </h2>
        </div>
        <CloseButton onClick={onBack} />
      </div>

      <div className="space-y-4">
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
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              {overEnrolled
                ? `This program has ${activeEnrollmentCount} enrolments (maximum capacity is ${maxParticipants ?? '—'}). Cancellation will affect confirmed and pending enrolments.`
                : `This program has ${activeEnrollmentCount} enrolment${activeEnrollmentCount === 1 ? '' : 's'}. Cancellation will affect confirmed and pending enrolments.`}
            </p>
            <WarningBox
              items={[
                'All registered employees will be notified about the cancellation.',
                'All confirmed and pending enrolments will be cancelled.',
                'This action cannot be undone.',
              ]}
            />
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
