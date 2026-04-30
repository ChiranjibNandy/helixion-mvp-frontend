'use client';

import { CheckCircle2, XCircle, RotateCcw, Download, ArrowRight } from 'lucide-react';
import { ImportResults } from '@/types/bulk-import';
import Link from 'next/link';

interface StepResultsProps {
  results: ImportResults | null;
  onReset: () => void;
}

export default function StepResults({ results, onReset }: StepResultsProps) {
  if (!results) return null;

  const isSuccess = results.success;

  return (
    <div className="p-8">
      <div className="max-w-lg mx-auto text-center space-y-6">
        {/* Icon */}
        <div className={`
          w-20 h-20 rounded-full mx-auto flex items-center justify-center
          ${isSuccess
            ? 'bg-accentGreen/10 border-2 border-accentGreen/30'
            : 'bg-accentRed/10 border-2 border-accentRed/30'
          }
        `}>
          {isSuccess ? (
            <CheckCircle2 className="text-accentGreen" size={36} />
          ) : (
            <XCircle className="text-accentRed" size={36} />
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className={`text-xl font-bold ${isSuccess ? 'text-accentGreen' : 'text-accentRed'}`}>
            {isSuccess ? 'Import Successful!' : 'Import Failed'}
          </h2>
          <p className="text-sm text-textSidebarMuted mt-2">
            {isSuccess
              ? `Successfully created ${results.createdCount} user account${results.createdCount > 1 ? 's' : ''}`
              : results.errorMessage || 'An error occurred during the import process'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1">Submitted</p>
            <p className="text-2xl font-bold text-white">{results.totalSubmitted}</p>
          </div>
          <div className={`rounded-xl border p-4 ${
            isSuccess
              ? 'bg-accentGreen/5 border-accentGreen/20'
              : 'bg-accentRed/5 border-accentRed/20'
          }`}>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1">
              {isSuccess ? 'Created' : 'Failed'}
            </p>
            <p className={`text-2xl font-bold ${isSuccess ? 'text-accentGreen' : 'text-accentRed'}`}>
              {isSuccess ? results.createdCount : results.totalSubmitted}
            </p>
          </div>
        </div>

        {/* Error details */}
        {!isSuccess && results.errorMessage && (
          <div className="bg-accentRed/5 rounded-xl border border-accentRed/20 p-4 text-left">
            <p className="text-xs font-semibold text-accentRed mb-1">Error Details</p>
            <p className="text-xs text-accentRed/70 font-mono leading-relaxed">{results.errorMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white/50 bg-white/5
                       rounded-lg hover:bg-white/10 transition-all duration-200 border border-white/10"
            id="results-import-again-btn"
          >
            <RotateCcw size={14} />
            Import More Users
          </button>

          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white
                       bg-primary rounded-lg hover:bg-primaryDark transition-all duration-200
                       shadow-glow"
            id="results-dashboard-btn"
          >
            Go to Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
