'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { FileText, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { userService, BatchCreateResponse } from '@/services/userService';
import { formatFileSize } from '@/utils/csv-parser';
import { parseBulkUploadFile, validateBulkEmployeeRows, rowsToCsvFile, ValidatedBulkEmployeeRow } from '@/utils/parseBulkUploadFile';
import { t } from '@/lib/i18n';
import FileDropzone from '@/components/shared/FileDropzone';
import PageHeader from '@/components/ui/pageHeader';
import BulkUploadPreview from './BulkUploadPreview';

// "success" from the request's point of view (the HTTP call itself didn't
// throw) is NOT the same as "the import succeeded" — a 201 response can
// still mean every single row was rejected server-side. Distinguishing
// these explicitly so the modal/toast never claims success when nothing
// was actually imported.
type CommitOutcome = 'full' | 'partial' | 'allSkipped' | 'requestFailed';

interface CommitResult {
  outcome: CommitOutcome;
  data?: BatchCreateResponse;
  errorMessage?: string;
}

// Single source of truth for the title/description shown for a given
// result — used by BOTH the toast and the modal, so they can't drift out
// of sync with each other the way they did before (the modal was reading
// createdCount alone while the toast read created+updated combined).
function getOutcomeMessage(result: CommitResult): { title: string; description: string; isGood: boolean; severity: 'green' | 'orange' | 'red' } {
  const { outcome, data, errorMessage } = result;
  const created = data?.createdCount ?? 0;
  const updated = data?.updatedCount ?? 0;
  const skipped = data?.skippedCount ?? 0;
  const succeeded = created + updated;

  if (outcome === 'full') {
    // Every row succeeded, but "0 created, N updated" means every single
    // one of those rows already existed — re-uploading the exact same data
    // isn't a fresh approval, and saying "approved" here would be wrong.
    if (created === 0 && updated > 0) {
      return {
        title: t('bulkImport.results.alreadyUploadedTitle'),
        description: t('bulkImport.results.alreadyUploadedDescription', { count: updated, countPlural: updated === 1 ? '' : 's' }),
        isGood: true,
        severity: 'green',
      };
    }
    return {
      title: t('bulkImport.results.successTitle'),
      description: t('bulkImport.results.successDescription', { count: succeeded }),
      isGood: true,
      severity: 'green',
    };
  }

  if (outcome === 'partial') {
    return {
      title: t('bulkImport.results.partialTitle'),
      description: t('bulkImport.results.partialDescription', {
        succeeded,
        succeededPlural: succeeded === 1 ? '' : 's',
        skipped,
        skippedPlural: skipped === 1 ? '' : 's',
      }),
      isGood: false,
      severity: 'orange',
    };
  }

  if (outcome === 'allSkipped') {
    return {
      title: t('bulkImport.results.allSkippedTitle'),
      description: t('bulkImport.results.allSkippedDescription', { skipped, skippedPlural: skipped === 1 ? '' : 's' }),
      isGood: false,
      severity: 'red',
    };
  }

  return {
    title: t('bulkImport.results.failureTitle'),
    description: errorMessage || t('bulkImport.results.failureDescription'),
    isGood: false,
    severity: 'red',
  };
}

// Matches the backend's CSV/XLSX column set (helixion-mvp-backend
// mapSpreadsheetEmployee.ts — the columns are human-readable, not
// machine-friendly keys, so header text must match exactly).
const CSV_TEMPLATE = `Employee Roll No.,Name of the employee,Email,Mobile,Place of Posting,Designation,Department,Manager,Training Department Officer (CTD),OSD Officer,Reporting Manager Email,Skip Level 1 Manager Email,Skip Level 2 Manager Email
E1001,Arjun Mehta,arjun@corp.in,9876543210,Mumbai,Analyst,Finance,No,No,No,manager@corp.in,,
E1002,Sara Iyer,sara@corp.in,9876543211,Delhi,Senior Analyst,Finance,Yes,No,No,manager@corp.in,skiplevel1@corp.in,`;

// These fields feed emailsInFile / manager-reference matching in
// validateBulkEmployeeRows, which is built from the parser's toRow() output
// — that always lowercases them. A hand-edited value that isn't normalized
// the same way silently breaks matching against untouched rows (e.g. row A's
// email edited to "Alice@x.com" no longer matches row B's still-lowercase
// "alice@x.com" reference to it).
const EMAIL_FIELDS = new Set(['email', 'reportingManagerEmail', 'skipLevel1ManagerEmail', 'skipLevel2ManagerEmail']);

export default function BulkImportWizard() {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<ValidatedBulkEmployeeRow[] | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitResult, setCommitResult] = useState<CommitResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Server-reported errors from a previous "Fix skipped rows" cycle, keyed
  // by row id. A ref (not state) because it's an overlay applied on top of
  // previewRows on every update, not something rendered directly — using
  // state here would mean choosing between two equally-wrong update orders
  // (stale closure vs. a second re-render). Cleared per-row the moment that
  // specific row is edited; untouched rows keep showing their real error
  // through any number of edits elsewhere, which is the bug this fixes.
  const serverErrorsByRowIdRef = useRef<Record<string, string>>({});

  // validateBulkEmployeeRows is O(n) over the whole file (rebuilds a
  // duplicate-code map and an emailsInFile set, then re-scans every row) —
  // fine as a one-off, but re-running it synchronously on every single
  // keystroke in a text field makes typing laggy on a large upload. The
  // field itself still updates immediately (see handleRowEdit) so typing
  // never feels blocked; only the expensive re-validation pass is debounced.
  const revalidateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (revalidateTimeoutRef.current) clearTimeout(revalidateTimeoutRef.current);
  }, []);

  const applyServerErrors = useCallback((rows: ValidatedBulkEmployeeRow[]): ValidatedBulkEmployeeRow[] =>
    rows.map((row) => {
      const serverError = serverErrorsByRowIdRef.current[row._rowId];
      if (!serverError) return row;
      return { ...row, severity: 'error' as const, issues: [serverError, ...row.issues.filter((i) => i !== serverError)] };
    }), []);

  const handleFileSelected = useCallback(async (selected: File) => {
    setFile(selected);
    setParseError(null);
    setPreviewRows(null);
    serverErrorsByRowIdRef.current = {};
    setIsParsing(true);
    try {
      const rows = await parseBulkUploadFile(selected);
      setPreviewRows(validateBulkEmployeeRows(rows));
    } catch (err: any) {
      setParseError(err?.message || 'Could not parse this file.');
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setPreviewRows(null);
    setParseError(null);
    setCommitResult(null);
    serverErrorsByRowIdRef.current = {};
  }, []);

  // Edits made in the preview table re-run the same client-side validation
  // (issue counts/severity update live) rather than just patching the field
  // — e.g. fixing a duplicate Roll No. should also clear the error on the
  // other row that shared it.
  const handleRowEdit = useCallback((
    rowId: string,
    field: 'employeeCode' | 'name' | 'email' | 'mobile' | 'placeOfPosting' | 'designation' | 'department' | 'reportingManagerEmail' | 'skipLevel1ManagerEmail' | 'skipLevel2ManagerEmail',
    value: string
  ) => {
    const normalizedValue = EMAIL_FIELDS.has(field) ? value.trim().toLowerCase() : value;
    delete serverErrorsByRowIdRef.current[rowId]; // editing this row means the admin is addressing it

    // The field itself updates immediately — this is what the controlled
    // <input> is bound to, so it must never wait on the debounce below or
    // typing would visibly lag/stutter.
    setPreviewRows((prev) => {
      if (!prev) return prev;
      return prev.map((row) => (row._rowId === rowId ? { ...row, [field]: normalizedValue } : row));
    });

    // Issue counts/severity badges are a "soon-ish" concern, not an
    // every-keystroke one — debounced so the expensive full-file
    // re-validation runs once after the admin pauses, not on every character.
    if (revalidateTimeoutRef.current) clearTimeout(revalidateTimeoutRef.current);
    revalidateTimeoutRef.current = setTimeout(() => {
      setPreviewRows((prev) => (prev ? applyServerErrors(validateBulkEmployeeRows(prev)) : prev));
    }, 250);
  }, [applyServerErrors]);

  // One CTD flag, one OSD flag per row — no Junior/Senior tiers. Training
  // Dept and OSD stay independent of each other, same as the underlying
  // officeRoles schema. Uniqueness across employees (only one CTD, one OSD
  // per org) is enforced server-side on commit, not here. isManager is a
  // separate axis entirely (orgRole, not officeRoles) with no such
  // uniqueness constraint — any number of employees can be Manager.
  const handleToggleOfficeRole = useCallback((rowId: string, field: 'isManager' | 'trainingDeptSenior' | 'osdSenior') => {
    delete serverErrorsByRowIdRef.current[rowId];
    setPreviewRows((prev) => {
      if (!prev) return prev;
      const updated = prev.map((row) => {
        if (row._rowId !== rowId) return row;
        return { ...row, [field]: !row[field] };
      });
      return applyServerErrors(validateBulkEmployeeRows(updated));
    });
  }, [applyServerErrors]);

  const handleConfirmCommit = useCallback(async () => {
    if (!file || !previewRows) return;
    setIsCommitting(true);

    try {
      // Upload what's actually in the (possibly hand-edited) preview table,
      // not the original file — previewRows may no longer match it.
      const csvFile = rowsToCsvFile(previewRows, file.name);
      const data = await userService.batchCreateUsers(csvFile);
      const succeededCount = data.createdCount + data.updatedCount;

      const outcome: CommitOutcome =
        data.skippedCount === 0 ? 'full' : succeededCount > 0 ? 'partial' : 'allSkipped';

      const result: CommitResult = { outcome, data };
      setCommitResult(result);

      const { description, severity } = getOutcomeMessage(result);
      if (severity === 'green') toast.success(description);
      else if (severity === 'orange') toast.warning(description);
      else toast.error(description);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || t('bulkImport.results.failureDescription');
      setCommitResult({ outcome: 'requestFailed', errorMessage });
      toast.error(errorMessage);
    } finally {
      setShowSuccessModal(true);
      setIsCommitting(false);
    }
  }, [file, previewRows]);

  const handleDone = useCallback(() => {
    setShowSuccessModal(false);
    handleRemoveFile();
  }, [handleRemoveFile]);

  // Re-opens the preview with the file/edits intact (unlike handleDone,
  // which discards everything) and flags exactly the rows the server
  // rejected — using the real per-row reason it returned — so the admin can
  // fix just those rows and re-upload instead of starting the whole file
  // over.
  const handleFixSkippedRows = useCallback(() => {
    const skipped = commitResult?.data?.skipped;
    if (skipped && skipped.length > 0) {
      // Matched primarily by Employee Roll No., not email — two rows can
      // legitimately share an email (validateBulkEmployeeRows only enforces
      // Roll No. uniqueness), so matching on email alone could attribute
      // the same server error to both, or to the wrong one. Falls back to
      // email only for a row with no roll no. at all.
      const errorByCode = new Map(
        skipped.filter((s) => s.employeeCode).map((s) => [s.employeeCode!, s.error])
      );
      const errorByEmail = new Map(
        skipped.filter((s) => s.email).map((s) => [s.email!.toLowerCase(), s.error])
      );
      setPreviewRows((prev) => {
        if (!prev) return prev;
        // Rebuilt from scratch each cycle, keyed by row id (not email —
        // the email itself might get edited) so applyServerErrors keeps
        // flagging these rows through any number of edits to OTHER rows,
        // and stops only once THIS row is edited (see handleRowEdit).
        const next: Record<string, string> = {};
        const flagged = prev.map((row) => {
          const serverError = errorByCode.get(row.employeeCode) ?? errorByEmail.get(row.email.toLowerCase());
          if (!serverError) return row;
          next[row._rowId] = serverError;
          return {
            ...row,
            severity: 'error' as const,
            issues: [serverError, ...row.issues.filter((i) => i !== serverError)],
          };
        });
        serverErrorsByRowIdRef.current = next;
        return flagged;
      });
    }
    setShowSuccessModal(false);
  }, [commitResult]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-textSidebarMuted">{t('bulkImport.breadcrumb.users')}</span>
        <span className="text-textSidebarMuted">/</span>
        <span className="text-primary font-medium">{t('bulkImport.breadcrumb.bulkImport')}</span>
      </div>

      <PageHeader
        title={t('bulkImport.header.title')}
        description={t('bulkImport.header.description')}
      />

      {/* Step 1 — Download template */}
      <div>
        <p className="text-xs text-textSidebarMuted mb-3">{t('bulkImport.template.stepLabel')}</p>
        <div className="flex items-center justify-between p-4 rounded-xl bg-bgStatCard border border-borderCard">
          <div>
            <p className="text-sm font-medium text-white">{t('bulkImport.template.fileName')}</p>
            <p className="text-xs text-textSidebarMuted mt-1">
              Columns: Employee Roll No., Name, Email, Mobile, Place of Posting, Designation, Department,
              Training Dept / OSD officer flags, Reporting Manager Email, Skip Level 1/2 Manager Email.
              Accepts .csv, .xls, or .xlsx.
            </p>
          </div>
          <button
            onClick={() => {
              const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'employee_bulk_upload_template.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-5 py-2 text-sm font-medium text-white bg-white/5 border border-white/10
                   rounded-lg hover:bg-white/10 transition-all duration-200"
            id="download-template-btn"
          >
            {t('bulkImport.template.downloadButton')}
          </button>
        </div>
      </div>

      {/* Step 2 — Upload file, then preview before committing */}
      {!previewRows && (
        <div>
          <p className="text-xs text-textSidebarMuted mb-3">{t('bulkImport.upload.stepLabel')}</p>

          {!file ? (
            <FileDropzone
              accept=".csv,.xls,.xlsx"
              isProcessing={false}
              label={
                <>
                  Drop <span className="text-primary">.csv / .xlsx</span> file here or{' '}
                  <span className="text-primary">click to browse</span>
                </>
              }
              hint={t('bulkImport.upload.hint')}
              fileInputRef={fileInputRef}
              inputId="bulk-import-file-input"
              onFileSelected={handleFileSelected}
            />
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl bg-bgStatCard border border-borderCard">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-textSidebarMuted">
                    {formatFileSize(file.size)}
                    {isParsing && ' · Parsing…'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleRemoveFile}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {parseError && (
            <div className="mt-3 flex items-start gap-3 p-4 rounded-lg bg-accentRed/10 border border-accentRed/20">
              <AlertCircle className="text-accentRed flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-accentRed">{parseError}</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Review every parsed row before it's actually uploaded */}
      {previewRows && file && (
        <div className="rounded-xl bg-bgStatCard border border-borderCard overflow-hidden">
          <BulkUploadPreview
            rows={previewRows}
            fileName={file.name}
            isUploading={isCommitting}
            onConfirm={handleConfirmCommit}
            onBack={handleRemoveFile}
            onRowEdit={handleRowEdit}
            onToggleOfficeRole={handleToggleOfficeRole}
          />
        </div>
      )}

      {/* Results Modal */}
      {showSuccessModal && commitResult && (() => {
        const { data } = commitResult;
        const { title, description, isGood, severity: iconColor } = getOutcomeMessage(commitResult);

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-bgStatCard border border-borderCard rounded-2xl p-8 shadow-2xl">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${
              iconColor === 'green' ? 'bg-accentGreen/10 border-accentGreen/30'
              : iconColor === 'orange' ? 'bg-accentOrange/10 border-accentOrange/30'
              : 'bg-accentRed/10 border-accentRed/30'
            }`}>
              {isGood ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="2" />
                  <path d="M8 12.5L11 15.5L16 9.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke={iconColor === 'orange' ? '#f59e0b' : '#dc2626'} strokeWidth="2" />
                  <path d="M15 9L9 15M9 9L15 15" stroke={iconColor === 'orange' ? '#f59e0b' : '#dc2626'} strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>

            <h3 className={`text-lg font-semibold mb-3 ${isGood ? 'text-white' : iconColor === 'orange' ? 'text-accentOrange' : 'text-accentRed'}`}>
              {title}
            </h3>

            <p className="text-sm text-textSidebarMuted leading-relaxed mb-4">
              {description}
            </p>

            {data && (
              <div className="flex flex-col gap-2 text-sm mb-8">
                <div className="flex items-center gap-2">
                  {data.createdCount > 0 && (
                    <span className="text-accentGreen">
                      {t('bulkImport.results.approved', { count: data.createdCount })}
                    </span>
                  )}
                  {data.createdCount > 0 && data.updatedCount > 0 && (
                    <span className="text-textSidebarMuted">·</span>
                  )}
                  {data.updatedCount > 0 && (
                    <span className="text-accentOrange">
                      {t('bulkImport.results.roleUpdated', { count: data.updatedCount })}
                    </span>
                  )}
                </div>
                {data.skippedCount > 0 && (
                  <div className="text-xs text-accentRed space-y-1">
                    <p className="font-medium">
                      {data.skippedCount} row{data.skippedCount > 1 ? 's' : ''} skipped by the server:
                    </p>
                    {data.skipped && data.skipped.length > 0 ? (
                      <ul className="space-y-1 max-h-40 overflow-y-auto">
                        {data.skipped.map((s, i) => (
                          <li key={i} className="text-accentRed/80">
                            <span className="font-mono">{s.email || 'unknown row'}</span>: {s.error}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-accentRed/80">{data.skippedEmails.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              {data && data.skippedCount > 0 ? (
                <>
                  <button
                    onClick={handleDone}
                    className="px-5 py-2.5 text-sm text-white/60 bg-white/5 border border-white/10
                               rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    Discard & start over
                  </button>
                  <button
                    onClick={handleFixSkippedRows}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-primary
                               rounded-lg hover:bg-primaryDark transition-all duration-200"
                    id="fix-skipped-rows-btn"
                  >
                    Fix skipped rows
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDone}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-primary
                             rounded-lg hover:bg-primaryDark transition-all duration-200"
                  id="success-done-btn"
                >
                  {t('bulkImport.results.doneButton')}
                </button>
              )}
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
