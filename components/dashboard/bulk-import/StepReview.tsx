'use client';

import { Loader2 } from 'lucide-react';
import { BulkUser } from '@/types/bulk-import';

interface StepReviewProps {
  users: BulkUser[];
  fileName: string;
  fileSize: string;
  fileRows: number;
  validCount: number;
  errorCount: number;
  warningCount: number;
  skippedCount: number;
  isCommitting: boolean;
  onRemove: () => void;
  onReUpload: () => void;
  onCommit: () => void;
}

export default function StepReview({
  users,
  fileName,
  fileSize,
  fileRows,
  validCount,
  errorCount,
  warningCount,
  skippedCount,
  isCommitting,
  onRemove,
  onReUpload,
  onCommit,
}: StepReviewProps) {
  return (
    <div className="space-y-6">
      {/* Uploaded File Info */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-bgStatCard border border-borderCard">
        <div>
          <p className="text-sm font-medium text-white">{fileName}</p>
          <p className="text-xs text-textSidebarMuted mt-1">
            {fileRows} rows · {fileSize}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-sm text-accentRed hover:text-accentRedHover transition-colors"
          id="remove-file-btn"
        >
          Remove
        </button>
      </div>

      {/* Preview Table Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-textSidebarMuted">Preview — read only</p>
        <div className="flex items-center gap-3">
          {validCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#16a34a]/10 border border-[#16a34a]/20">
              <span className="text-[10px] font-medium text-[#16a34a]">{validCount} valid</span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accentRed/10 border border-accentRed/20">
              <span className="text-[10px] font-medium text-accentRed">{errorCount} error</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accentOrange/10 border border-accentOrange/20">
              <span className="text-[10px] font-medium text-accentOrange">{warningCount} warning</span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bgStatCard rounded-xl border border-borderCard overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-textSidebarMuted">#</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-textSidebarMuted">Email</th>
                <th className="text-center px-5 py-3 text-[11px] font-medium text-textSidebarMuted">Role</th>
                <th className="text-center px-5 py-3 text-[11px] font-medium text-textSidebarMuted">Action</th>
                <th className="text-center px-5 py-3 text-[11px] font-medium text-textSidebarMuted">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-textSidebarMuted">Note</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => {
                const isError = user.status === 'Error';
                const isWarning = user.status === 'Warning';
                const isValid = user.status === 'Valid';

                return (
                  <tr
                    key={user._rowId}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors relative"
                  >
                    {/* Status accent line */}
                    <td className="absolute left-0 top-0 bottom-0 w-[2px]">
                      <div className={`h-full w-full ${isError ? 'bg-accentRed' : isWarning ? 'bg-accentOrange' : 'bg-[#16a34a]'}`} />
                    </td>
                    <td className="px-5 py-3 text-xs text-textSidebarMuted w-12">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs ${isError ? 'text-white/40 line-through' : 'text-white'}`}>
                        {user.email}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-[11px] font-medium text-primary/80 bg-primary/10 px-2.5 py-1 rounded-md capitalize">
                        {user.role || 'employee'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-[11px] text-textSidebarMuted capitalize">
                        {user.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        isError ? 'text-accentRed bg-accentRed/10' :
                        isWarning ? 'text-accentOrange bg-accentOrange/10' :
                        'text-[#16a34a] bg-[#16a34a]/10'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] ${
                        isError ? 'text-accentRed' :
                        isWarning ? 'text-accentOrange' :
                        'text-textSidebarMuted'
                      }`}>
                        {user.note}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-2 text-xs text-textSidebarMuted bg-white/[0.01] border-t border-white/5">
          Preview is read-only. To make corrections, fix the source CSV and re-upload.
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-5 border-t border-white/5">
          <div className="text-sm">
            <span className="text-textSidebarMuted">Committing </span>
            <span className="text-white font-medium">{validCount} valid rows</span>
            {skippedCount > 0 && (
              <>
                <span className="text-textSidebarMuted"> · </span>
                <span className="text-accentRed font-medium">{skippedCount} skipped</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReUpload}
              disabled={isCommitting}
              className="px-5 py-2.5 text-sm text-textSidebarMuted bg-white/5 border border-white/10
                         rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed"
              id="review-reupload-btn"
            >
              Re-upload
            </button>

            <button
              onClick={onCommit}
              disabled={isCommitting || validCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white
                         bg-primary rounded-lg hover:bg-primaryDark transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed"
              id="review-submit-btn"
            >
              {isCommitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Committing...
                </>
              ) : (
                `Commit ${validCount} changes`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
