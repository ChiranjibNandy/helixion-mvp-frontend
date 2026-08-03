'use client';

import { ArrowLeft, FileSpreadsheet, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ValidatedBulkEmployeeRow } from '@/utils/parseBulkUploadFile';

interface BulkUploadPreviewProps {
  rows: ValidatedBulkEmployeeRow[];
  fileName: string;
  isUploading: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

function officeRoleBadges(row: ValidatedBulkEmployeeRow) {
  const badges: string[] = [];
  if (row.trainingDeptSenior) badges.push('CTD (Senior)');
  else if (row.trainingDeptJunior) badges.push('Training Dept (Junior)');
  if (row.osdSenior) badges.push('OSD (Senior)');
  else if (row.osdJunior) badges.push('OSD (Junior)');
  return badges;
}

export default function BulkUploadPreview({ rows, fileName, isUploading, onConfirm, onBack }: BulkUploadPreviewProps) {
  const errorCount = rows.filter((r) => r.severity === 'error').length;
  const warningCount = rows.filter((r) => r.severity === 'warning').length;
  const validCount = rows.length - errorCount - warningCount;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="text-primary" size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Preview Before Upload</h2>
              <p className="text-xs text-textSidebarMuted mt-0.5">
                File: <span className="text-white/50 font-mono">{fileName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-xs text-white/50">Total:</span>
              <span className="text-sm font-semibold text-white">{rows.length}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accentGreen/10 border border-accentGreen/20">
              <CheckCircle2 size={12} className="text-accentGreen" />
              <span className="text-xs font-medium text-accentGreen">{validCount} valid</span>
            </div>
            {warningCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accentOrange/10 border border-accentOrange/20">
                <AlertTriangle size={12} className="text-accentOrange" />
                <span className="text-xs font-medium text-accentOrange">{warningCount} warnings</span>
              </div>
            )}
            {errorCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accentRed/10 border border-accentRed/20">
                <AlertCircle size={12} className="text-accentRed" />
                <span className="text-xs font-medium text-accentRed">{errorCount} errors</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-bgSidebar z-10">
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">#</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Roll No.</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Manager Email</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Office Role</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const badges = officeRoleBadges(row);
              return (
                <tr
                  key={row._rowId}
                  className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
                    row.severity === 'error' ? 'bg-accentRed/[0.03]' : row.severity === 'warning' ? 'bg-accentOrange/[0.03]' : ''
                  }`}
                >
                  <td className="px-6 py-3"><span className="text-xs text-white/20 font-mono">{idx + 1}</span></td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-mono ${row.severity === 'error' ? 'text-accentRed' : 'text-white/70'}`}>
                      {row.employeeCode || <span className="text-white/20 italic">empty</span>}
                    </span>
                  </td>
                  <td className="px-6 py-3"><span className="text-xs text-white/80">{row.name || <span className="text-white/20 italic">empty</span>}</span></td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-mono ${row.severity === 'error' ? 'text-accentRed' : 'text-white/60'}`}>
                      {row.email || <span className="text-white/20 italic">empty</span>}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-mono text-white/50">{row.reportingManagerEmail || '—'}</span>
                  </td>
                  <td className="px-6 py-3">
                    {badges.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {badges.map((b) => (
                          <span key={b} className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded whitespace-nowrap">
                            {b}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-white/30">Employee</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {row.severity === 'valid' ? (
                      <span className="flex items-center gap-1 text-[10px] text-accentGreen font-medium">
                        <CheckCircle2 size={11} /> Valid
                      </span>
                    ) : (
                      <div className="group relative inline-block">
                        <span
                          className={`flex items-center gap-1 text-[10px] font-medium cursor-help ${
                            row.severity === 'error' ? 'text-accentRed' : 'text-accentOrange'
                          }`}
                        >
                          {row.severity === 'error' ? <AlertCircle size={11} /> : <AlertTriangle size={11} />}
                          {row.issues.length} issue{row.issues.length > 1 ? 's' : ''}
                        </span>
                        <div className="absolute right-0 top-full mt-1 z-20 hidden group-hover:block w-64">
                          <div className="bg-bgSidebar border border-white/10 rounded-lg p-3 shadow-xl">
                            {row.issues.map((msg, i) => (
                              <p key={i} className={`text-[10px] leading-relaxed ${row.severity === 'error' ? 'text-accentRed/80' : 'text-accentOrange/80'}`}>
                                • {msg}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Warning banner */}
      {(errorCount > 0 || warningCount > 0) && (
        <div className="mx-6 mt-4 flex items-start gap-3 p-4 rounded-lg bg-accentOrange/10 border border-accentOrange/20">
          <AlertTriangle className="text-accentOrange flex-shrink-0 mt-0.5" size={16} />
          <div>
            {errorCount > 0 && (
              <p className="text-sm text-accentOrange font-medium">
                {errorCount} row{errorCount > 1 ? 's have' : ' has'} errors (duplicate roll number or invalid/missing email) — these rows will fail on the server.
              </p>
            )}
            {warningCount > 0 && (
              <p className="text-xs text-accentOrange/70 mt-0.5">
                {warningCount} row{warningCount > 1 ? 's reference' : ' references'} a manager email not found in this file — that link will only resolve if the manager already exists in the org.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-white/5 mt-4">
        <button
          onClick={onBack}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/50 bg-white/5
                     rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-40"
          id="preview-back-btn"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={isUploading}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white
                     bg-primary rounded-lg hover:bg-primaryDark transition-all duration-200
                     shadow-glow disabled:opacity-50"
          id="preview-confirm-upload-btn"
        >
          {isUploading ? 'Uploading...' : `Confirm & Upload ${rows.length} Row${rows.length === 1 ? '' : 's'}`}
        </button>
      </div>
    </div>
  );
}
