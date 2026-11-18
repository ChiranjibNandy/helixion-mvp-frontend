import { AlertTriangle, CalendarClock, ImageIcon, Lock } from 'lucide-react';
import { DraftProgram } from '@/types';
import { formatDate } from './utils';

interface ProgramSummaryHeaderProps {
  program: DraftProgram;
  enrolledCount: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
  isCancelled: boolean;
  isFrozen: boolean;
  onCancelProgram: () => void;
  onFreezeEnrollments: () => void;
}

const daysToGo = (startDate: string): number | null => {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return null;
  const diffMs = start.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diffMs / 86_400_000);
};

export default function ProgramSummaryHeader({
  program,
  enrolledCount,
  pendingCount,
  confirmedCount,
  cancelledCount,
  isCancelled,
  isFrozen,
  onCancelProgram,
  onFreezeEnrollments,
}: ProgramSummaryHeaderProps) {
  const days = daysToGo(program.startDate);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 shrink-0 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <ImageIcon size={20} className="text-gray-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{program.title}</h1>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(program.startDate)} – {formatDate(program.endDate)} · {[program.venueName, program.city].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-sm">
        <span className="text-gray-500">Min: <span className="text-gray-900 font-medium">{program.minParticipants ?? '-'}</span></span>
        <span className="text-gray-500">Max: <span className="text-gray-900 font-medium">{program.maxParticipants ?? '-'}</span></span>
        <span className="text-gray-500">Enrolled: <span className="text-gray-900 font-medium">{enrolledCount}</span></span>
        <span className="text-gray-500">
          Pending: <span className="inline-flex items-center px-1.5 rounded text-xs font-medium bg-amber-100 text-amber-700">{pendingCount}</span>
        </span>
        <span className="text-gray-500">
          Confirmed: <span className="inline-flex items-center px-1.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">{confirmedCount}</span>
        </span>
        <span className="text-gray-500">
          Cancelled: <span className="inline-flex items-center px-1.5 rounded text-xs font-medium bg-red-100 text-red-700">{cancelledCount}</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          {!isCancelled && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium border ${
              isFrozen ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}>
              {isFrozen ? 'Enrolments Closed' : 'Enrolments Open'}
            </span>
          )}
          {!isCancelled && !isFrozen && days !== null && days >= 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600 border border-gray-200">
              <CalendarClock size={12} /> {days === 0 ? 'Starts today' : `${days} day${days === 1 ? '' : 's'} to go`}
            </span>
          )}
        </div>

        {!isCancelled && (
          <div className="flex items-center gap-2">
            {!isFrozen && (
              <button
                onClick={onCancelProgram}
                className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
              >
                <AlertTriangle size={13} /> Cancel Program
              </button>
            )}
            {!isFrozen && (
              <button
                onClick={onFreezeEnrollments}
                className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500"
              >
                <Lock size={13} /> Close &amp; Freeze Enrolments
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
