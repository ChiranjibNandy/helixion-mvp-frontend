import CapacityRing from '../CapacityRing';
import { DraftProgram } from '@/types';
import { formatDate } from './utils';

interface ProgramSummaryHeaderProps {
  program: DraftProgram;
  activeCount: number;
  ringStatus: 'ok' | 'warning' | 'danger';
}

export default function ProgramSummaryHeader({ program, activeCount, ringStatus }: ProgramSummaryHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-5 flex-wrap">
          <h1 className="text-lg font-semibold text-gray-900">
            {program.title}
          </h1>

          {program.isFreeze && (
            <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 font-semibold text-red-600 whitespace-nowrap">
              Enrolments Closed (Frozen)
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatDate(program.startDate)} – {formatDate(program.endDate)} · {[program.venueName, program.city].filter(Boolean).join(', ')}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <CapacityRing value={activeCount} max={program.maxParticipants ?? 0} status={ringStatus} theme="light" />
        <div className="text-right text-sm">
          <p className="text-xs text-gray-400">Min</p>
          <p className="text-sm text-gray-900 font-medium">{program.minParticipants ?? '-'}</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-xs text-gray-400">Max</p>
          <p className="text-sm text-gray-900 font-medium">{program.maxParticipants ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}
