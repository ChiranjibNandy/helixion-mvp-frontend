import { CheckCircle2 } from 'lucide-react';
import { CloseButton, IconBadge } from './ModalPrimitives';

export default function SuccessStep({
  programTitle,
  onClose,
  onViewDetails,
}: {
  programTitle: string;
  onClose: () => void;
  onViewDetails?: () => void;
}) {
  return (
    <>
      <div className="flex justify-end mb-1">
        <CloseButton onClick={onClose} />
      </div>
      <div className="space-y-4 -mt-4">
        <IconBadge tone="green"><CheckCircle2 size={24} /></IconBadge>
        <h2 className="text-lg font-semibold text-gray-900">Training Program Cancelled</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{programTitle} has been cancelled successfully.</p>
        <div className="rounded-lg bg-green-50 border border-green-100 p-3 space-y-1.5">
          <p className="text-sm text-green-700 flex gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5" /> All enrolled employees have been notified.</p>
          <p className="text-sm text-green-700 flex gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5" /> All confirmed and pending enrolments have been cancelled.</p>
          <p className="text-sm text-green-700 flex gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5" /> You can view the cancellation details in Program Details.</p>
        </div>
        <div className="flex justify-end pt-1">
          <button
            onClick={() => { onClose(); onViewDetails?.(); }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            Go to Program Details
          </button>
        </div>
      </div>
    </>
  );
}
