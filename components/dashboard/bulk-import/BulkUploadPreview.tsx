'use client';

import { Fragment, useState } from 'react';
import { ArrowLeft, FileSpreadsheet, AlertTriangle, AlertCircle, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { ValidatedBulkEmployeeRow } from '@/utils/parseBulkUploadFile';
import { TextField, Checkbox } from '@/components/shared/FormFields';
import { t } from '@/lib/i18n';

type EditableField =
  | 'employeeCode'
  | 'name'
  | 'email'
  | 'mobile'
  | 'placeOfPosting'
  | 'designation'
  | 'department'
  | 'reportingManagerEmail'
  | 'skipLevel1ManagerEmail'
  | 'skipLevel2ManagerEmail';

type OfficeRoleField = 'isManager' | 'trainingDeptSenior' | 'osdSenior';

interface BulkUploadPreviewProps {
  rows: ValidatedBulkEmployeeRow[];
  fileName: string;
  isUploading: boolean;
  onConfirm: () => void;
  onBack: () => void;
  onRowEdit: (rowId: string, field: EditableField, value: string) => void;
  onToggleOfficeRole: (rowId: string, field: OfficeRoleField) => void;
}

/** Compact toggle used directly in the summary row — visible and editable
 *  without expanding, since Office Role is just 4 short flags (unlike the
 *  text fields, which genuinely need the full-size expanded panel). */
function RoleTogglePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // don't also trigger the row's expand/collapse
        onClick();
      }}
      className={`text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap border transition-colors ${
        active
          ? 'text-primary bg-primary/10 border-primary/30'
          : 'text-white/30 bg-transparent border-white/10 hover:border-white/25 hover:text-white/50'
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ row }: { row: ValidatedBulkEmployeeRow }) {
  if (row.severity === 'valid') {
    return (
      <span className="flex items-center gap-1 text-[11px] text-accentGreen font-medium whitespace-nowrap">
        <CheckCircle2 size={12} /> Valid
      </span>
    );
  }
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium whitespace-nowrap ${row.severity === 'error' ? 'text-accentRed' : 'text-accentOrange'}`}>
      {row.severity === 'error' ? <AlertCircle size={12} /> : <AlertTriangle size={12} />}
      {row.issues.length} issue{row.issues.length > 1 ? 's' : ''}
    </span>
  );
}

function RowEditPanel({
  row,
  onRowEdit,
  onToggleOfficeRole,
}: {
  row: ValidatedBulkEmployeeRow;
  onRowEdit: (field: EditableField, value: string) => void;
  onToggleOfficeRole: (field: OfficeRoleField) => void;
}) {
  return (
    <div className="p-5 bg-black/20 border-t border-white/5 space-y-4">
      {row.issues.length > 0 && (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${row.severity === 'error' ? 'bg-accentRed/10 border-accentRed/20' : 'bg-accentOrange/10 border-accentOrange/20'}`}>
          {row.severity === 'error' ? (
            <AlertCircle className="text-accentRed flex-shrink-0 mt-0.5" size={14} />
          ) : (
            <AlertTriangle className="text-accentOrange flex-shrink-0 mt-0.5" size={14} />
          )}
          <div className="space-y-1">
            {row.issues.map((msg, i) => (
              <p key={i} className={`text-xs ${row.severity === 'error' ? 'text-accentRed/90' : 'text-accentOrange/90'}`}>
                {msg}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Basic details</h4>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Employee Roll No." required value={row.employeeCode} onChange={(v) => onRowEdit('employeeCode', v)} placeholder="e.g. E1001" />
            <TextField label="Name" required value={row.name} onChange={(v) => onRowEdit('name', v)} placeholder="Jane Doe" />
            <TextField label="Email" required value={row.email} onChange={(v) => onRowEdit('email', v)} placeholder="jane@corp.in" />
            <TextField label="Mobile" value={row.mobile} onChange={(v) => onRowEdit('mobile', v)} />
            <TextField label="Place of Posting" value={row.placeOfPosting} onChange={(v) => onRowEdit('placeOfPosting', v)} />
            <TextField label="Designation" value={row.designation} onChange={(v) => onRowEdit('designation', v)} />
          </div>
          <div className="mt-3">
            <TextField label="Department" value={row.department} onChange={(v) => onRowEdit('department', v)} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Reporting chain</h4>
            <div className="space-y-3">
              <TextField label="Reporting Manager Email" required value={row.reportingManagerEmail} onChange={(v) => onRowEdit('reportingManagerEmail', v)} placeholder="manager@corp.in" />
              <TextField label="Skip Level 1 Manager Email" value={row.skipLevel1ManagerEmail} onChange={(v) => onRowEdit('skipLevel1ManagerEmail', v)} />
              <TextField label="Skip Level 2 Manager Email" value={row.skipLevel2ManagerEmail} onChange={(v) => onRowEdit('skipLevel2ManagerEmail', v)} />
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Office roles</h4>
            <div className="grid grid-cols-3 gap-2">
              <Checkbox label={t('bulkImport.rolePanel.managerLabel')} checked={row.isManager} onChange={() => onToggleOfficeRole('isManager')} />
              <Checkbox label="CTD (Training Dept Officer)" checked={row.trainingDeptSenior} onChange={() => onToggleOfficeRole('trainingDeptSenior')} />
              <Checkbox label="OSD Officer" checked={row.osdSenior} onChange={() => onToggleOfficeRole('osdSenior')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BulkUploadPreview({ rows, fileName, isUploading, onConfirm, onBack, onRowEdit, onToggleOfficeRole }: BulkUploadPreviewProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
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
                File: <span className="text-white/50 font-mono">{fileName}</span> · Click a row to view &amp; edit every field
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

      {/* Table — no inner scroll container: an expanded row's edit panel
          should never be boxed into a nested scrollbar. For large row
          counts the page itself scrolls instead, which is the normal,
          unsurprising way to browse a long list. */}
      <div>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-bgSidebar z-10">
            <tr className="border-b border-white/5">
              <th className="w-8 px-4 py-3"></th>
              <th className="text-left px-2 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">#</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Roll No.</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Manager Email</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Office Role</th>
              <th className="text-left px-4 py-3 pr-6 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isExpanded = expandedRowId === row._rowId;
              return (
                <Fragment key={row._rowId}>
                  <tr
                    onClick={() => setExpandedRowId(isExpanded ? null : row._rowId)}
                    className={`border-b border-white/[0.03] cursor-pointer transition-colors hover:bg-white/[0.03] ${
                      isExpanded ? 'bg-white/[0.03]' : row.severity === 'error' ? 'bg-accentRed/[0.03]' : row.severity === 'warning' ? 'bg-accentOrange/[0.03]' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5 text-white/30">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </td>
                    <td className="px-2 py-3.5"><span className="text-xs text-white/20 font-mono">{idx + 1}</span></td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-mono ${!row.employeeCode ? 'text-accentRed' : 'text-white/80'}`}>
                        {row.employeeCode || <span className="italic text-accentRed/70">missing</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-white/80">{row.name || <span className="italic text-white/25">missing</span>}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-mono ${!row.email ? 'text-accentRed' : 'text-white/70'}`}>
                        {row.email || <span className="italic text-accentRed/70">missing</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-mono ${!row.reportingManagerEmail ? 'text-accentRed' : 'text-white/60'}`}>
                        {row.reportingManagerEmail || <span className="italic text-accentRed/70">missing</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 min-w-[260px]">
                      <div className="flex flex-wrap items-center gap-1">
                        {!row.isManager && !row.trainingDeptSenior && !row.osdSenior && (
                          // Not a toggle — there's no separate "employee" flag to
                          // flip, this is just the baseline state when none of
                          // the role flags below is set. Shown so it's
                          // visually confirmed, not just implied by absence.
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap bg-white/5 text-white/40 border border-white/10">
                            Employee
                          </span>
                        )}
                        <RoleTogglePill label={t('bulkImport.rolePanel.managerLabel')} active={row.isManager} onClick={() => onToggleOfficeRole(row._rowId, 'isManager')} />
                        <RoleTogglePill label="CTD" active={row.trainingDeptSenior} onClick={() => onToggleOfficeRole(row._rowId, 'trainingDeptSenior')} />
                        <RoleTogglePill label="OSD" active={row.osdSenior} onClick={() => onToggleOfficeRole(row._rowId, 'osdSenior')} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 pr-6"><StatusBadge row={row} /></td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <RowEditPanel
                          row={row}
                          onRowEdit={(field, value) => onRowEdit(row._rowId, field, value)}
                          onToggleOfficeRole={(field) => onToggleOfficeRole(row._rowId, field)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
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
                {errorCount} row{errorCount > 1 ? 's have' : ' has'} errors (duplicate roll number or invalid/missing email) — click a row to fix it before uploading.
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
