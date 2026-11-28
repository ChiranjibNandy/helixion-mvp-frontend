import { AlertTriangle, CalendarClock, ImageIcon, Lock } from 'lucide-react';
import { DraftProgram } from '@/types';
import { Button } from '@/components/ui/button';
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
          <div className="w-14 h-14 shrink-0 rounded-lg bg-gradient-to-br from-bgStatCard to-bgButton flex items-center justify-center">
            <ImageIcon size={20} className="text-textSidebarMuted" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{program.title}</h1>
            <p className="text-xs text-textSidebarMuted mt-1">
              {formatDate(program.startDate)} – {formatDate(program.endDate)} · {[program.venueName, program.city].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-sm">
        <span className="text-textSidebarMuted">Min: <span className="text-white font-medium">{program.minParticipants ?? '-'}</span></span>
        <span className="text-textSidebarMuted">Max: <span className="text-white font-medium">{program.maxParticipants ?? '-'}</span></span>
        <span className="text-textSidebarMuted">Enrolled: <span className="text-white font-medium">{enrolledCount}</span></span>
        <span className="text-textSidebarMuted">
          Pending: <span className="inline-flex items-center px-1.5 rounded text-xs font-medium bg-amber-500/15 text-amber-400">{pendingCount}</span>
        </span>
        <span className="text-textSidebarMuted">
          Confirmed: <span className="inline-flex items-center px-1.5 rounded text-xs font-medium bg-emerald-500/15 text-emerald-400">{confirmedCount}</span>
        </span>
        <span className="text-textSidebarMuted">
          Cancelled: <span className="inline-flex items-center px-1.5 rounded text-xs font-medium bg-red-500/15 text-red-400">{cancelledCount}</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          {!isCancelled && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium border ${
              isFrozen ? 'bg-bgButton text-textSecondary border-borderCard' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}>
              {isFrozen ? 'Enrolments Closed' : 'Enrolments Open'}
            </span>
          )}
          {!isCancelled && !isFrozen && days !== null && days >= 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium bg-bgButton text-textSecondary border border-borderCard">
              <CalendarClock size={12} /> {days === 0 ? 'Starts today' : `${days} day${days === 1 ? '' : 's'} to go`}
            </span>
          )}
        </div>

        {!isCancelled && (
          <div className="flex items-center gap-2">
            {!isFrozen && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelProgram}
                className="text-red-400 border-red-500/30 bg-transparent hover:bg-red-500/10"
              >
                <AlertTriangle size={13} /> Cancel Program
              </Button>
            )}
            {!isFrozen && (
              <Button
                size="sm"
                onClick={onFreezeEnrollments}
                className="bg-primary hover:bg-primaryDark text-white"
              >
                <Lock size={13} /> Close &amp; Freeze Enrolments
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
