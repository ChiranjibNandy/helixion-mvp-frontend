import { DraftProgram } from '@/types';
import { CANCELLATION_REASON_LABEL, formatDate } from './utils';

interface ProgramDetailsPanelProps {
  program: DraftProgram;
  isCancelled: boolean;
}

export default function ProgramDetailsPanel({ program, isCancelled }: ProgramDetailsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm py-2">
      <div>
        <p className="text-xs text-gray-400 mb-1">Program Title</p>
        <p className="text-gray-900">{program.title}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Status</p>
        <p className="text-gray-900 capitalize">{program.status}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Dates</p>
        <p className="text-gray-900">{formatDate(program.startDate)} – {formatDate(program.endDate)}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Venue</p>
        <p className="text-gray-900">{[program.venueName, program.city].filter(Boolean).join(', ') || '-'}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Capacity</p>
        <p className="text-gray-900">{program.minParticipants ?? '-'} – {program.maxParticipants ?? '-'}</p>
      </div>
      {program.stayOptions && program.stayOptions.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Fees</p>
          <div className="flex flex-col gap-0.5">
            {program.stayOptions.map((opt) => (
              <p key={opt.type} className="text-gray-900">{opt.type.replace(/_/g, ' ')}: Rs. {opt.price}</p>
            ))}
          </div>
        </div>
      )}
      {isCancelled && program.cancellation && (
        <div className="col-span-2 mt-2 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700 mb-2">Cancellation Details</p>
          <p className="text-xs text-gray-600">
            Reason: {CANCELLATION_REASON_LABEL[program.cancellation.reason] ?? program.cancellation.reason}
          </p>
          {program.cancellation.note && (
            <p className="text-xs text-gray-600 mt-1">Note: {program.cancellation.note}</p>
          )}
          <p className="text-xs text-gray-600 mt-1">Cancelled on: {formatDate(program.cancellation.cancelledAt)}</p>
        </div>
      )}
    </div>
  );
}
