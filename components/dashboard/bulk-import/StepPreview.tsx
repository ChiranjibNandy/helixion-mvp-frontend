'use client';

import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, FileSpreadsheet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BulkUser } from '@/types/bulk-import';

interface StepPreviewProps {
  users: BulkUser[];
  fileName: string;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Validate a single user row and return errors
 */
function validateUser(user: BulkUser): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!user.username || user.username.trim().length === 0) {
    errors.username = 'Username is required';
  }

  if (!user.email || user.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.email = 'Invalid email format';
  }

  if (!user.password || user.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(user.password)) {
    errors.password = 'Must contain letter, number, and special character';
  }

  return errors;
}

export default function StepPreview({ users, fileName, onNext, onBack }: StepPreviewProps) {
  const validatedUsers = useMemo(() => {
    return users.map((u) => ({
      ...u,
      errors: validateUser(u),
    }));
  }, [users]);

  const errorCount = validatedUsers.filter((u) => Object.keys(u.errors || {}).length > 0).length;
  const validCount = validatedUsers.length - errorCount;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="text-primary" size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Preview Parsed Data</h2>
              <p className="text-xs text-textSidebarMuted mt-0.5">
                File: <span className="text-white/50 font-mono">{fileName}</span>
              </p>
            </div>
          </div>

          {/* Stats badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-xs text-white/50">Total:</span>
              <span className="text-sm font-semibold text-white">{users.length}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accentGreen/10 border border-accentGreen/20">
              <CheckCircle2 size={12} className="text-accentGreen" />
              <span className="text-xs font-medium text-accentGreen">{validCount} valid</span>
            </div>
            {errorCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accentRed/10 border border-accentRed/20">
                <AlertTriangle size={12} className="text-accentRed" />
                <span className="text-xs font-medium text-accentRed">{errorCount} errors</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">#</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Username</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Password</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {validatedUsers.map((user, idx) => {
              const hasErrors = Object.keys(user.errors || {}).length > 0;
              const errorMessages = Object.values(user.errors || {});

              return (
                <tr
                  key={user._rowId}
                  className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
                    hasErrors ? 'bg-accentRed/[0.03]' : ''
                  }`}
                >
                  <td className="px-6 py-3">
                    <span className="text-xs text-white/20 font-mono">{idx + 1}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs ${user.errors?.username ? 'text-accentRed' : 'text-white/80'}`}>
                      {user.username || <span className="text-white/20 italic">empty</span>}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-mono ${user.errors?.email ? 'text-accentRed' : 'text-white/60'}`}>
                      {user.email || <span className="text-white/20 italic">empty</span>}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-mono ${user.errors?.password ? 'text-accentRed' : 'text-white/40'}`}>
                      {'•'.repeat(Math.min(user.password.length, 12))}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {user.role ? (
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    ) : (
                      <span className="text-[10px] text-accentOrange bg-accentOrange/10 px-2 py-0.5 rounded">
                        Not assigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {hasErrors ? (
                      <div className="group relative">
                        <span className="flex items-center gap-1 text-[10px] text-accentRed font-medium cursor-help">
                          <AlertTriangle size={11} />
                          {errorMessages.length} issue{errorMessages.length > 1 ? 's' : ''}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute right-0 top-full mt-1 z-10 hidden group-hover:block w-56">
                          <div className="bg-bgSidebar border border-white/10 rounded-lg p-3 shadow-xl">
                            {errorMessages.map((msg, i) => (
                              <p key={i} className="text-[10px] text-accentRed/80 leading-relaxed">• {msg}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-accentGreen font-medium">
                        <CheckCircle2 size={11} />
                        Valid
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Error Warning Banner */}
      {errorCount > 0 && (
        <div className="mx-6 mt-4 flex items-start gap-3 p-4 rounded-lg bg-accentOrange/10 border border-accentOrange/20">
          <AlertTriangle className="text-accentOrange flex-shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-sm text-accentOrange font-medium">
              {errorCount} row{errorCount > 1 ? 's have' : ' has'} validation issues
            </p>
            <p className="text-xs text-accentOrange/70 mt-0.5">
              Rows with errors will be skipped during import. You can go back and fix the CSV file.
            </p>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between p-6 border-t border-white/5 mt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/50 bg-white/5
                     rounded-lg hover:bg-white/10 transition-all duration-200"
          id="preview-back-btn"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={validCount === 0}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white
                     bg-primary rounded-lg hover:bg-primaryDark transition-all duration-200
                     shadow-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          id="preview-next-btn"
        >
          Continue to Role Assignment
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
