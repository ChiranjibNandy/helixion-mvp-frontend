'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { FileText, X, AlertCircle, Download, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { userService, BatchCreateResponse } from '@/services/userService';
import { useBulkUploadJobPolling, isTerminal } from '@/hooks/useBulkUploadJobPolling';
import { formatFileSize } from '@/utils/formatters';
import { validateBulkEmployeeRows, rowsToCsvFile, ValidatedBulkEmployeeRow, BulkEmployeeRow } from '@/utils/parseBulkUploadFile';
import { downloadSampleTemplate } from '@/utils/downloadTemplate';
import { t } from '@/lib/i18n';
import FileDropzone from '@/components/shared/FileDropzone';
import PageHeader from '@/components/ui/pageHeader';
import { Progress } from '@/components/ui/progress';
import BulkUploadPreview from './BulkUploadPreview';
import { BULK_EMPLOYEE_SAMPLE_ROWS, BULK_EMPLOYEE_TEMPLATE_HEADERS } from '@/constants/bulk.Employee';
import { parseSpreadsheetFile } from '@/utils/parseBulkUpload';

type CommitOutcome = 'full' | 'partial' | 'allSkipped' | 'requestFailed';

interface CommitResult {
  outcome: CommitOutcome;
  data?: BatchCreateResponse;
  errorMessage?: string;
}

//change to row value what we need when upload
const isYes = (v: unknown) =>
  typeof v === 'string'
    ? v.trim().toLowerCase() === 'yes'
    : typeof v === 'boolean'
      ? v
      : false;

function toRow(raw: Record<string, any>, idx: number): BulkEmployeeRow {
  const str = (v: unknown) => {
    if (v === undefined || v === null) return '';
    return String(v).trim();
  };

  return {
    _rowId: `row-${idx}`,
    employeeCode: str(raw['Employee Roll No.']),
    name: str(raw['Name of the employee']),
    email: str(raw['Email']).toLowerCase(),
    mobile: str(raw['Mobile']),
    placeOfPosting: str(raw['Place of Posting']),
    designation: str(raw['Designation']),
    department: str(raw['Department']),
    trainingDeptSenior: isYes(raw['Training Department Officer (CTD)']),
    osdSenior: isYes(raw['OSD Officer']),
    isManager: isYes(raw['Manager']),
    reportingManagerEmail: str(raw['Reporting Manager Email']).toLowerCase(),
    skipLevel1ManagerEmail: str(raw['Skip Level 1 Manager Email']).toLowerCase(),
    skipLevel2ManagerEmail: str(raw['Skip Level 2 Manager Email']).toLowerCase(),
  };
}


function getOutcomeMessage(result: CommitResult): { title: string; description: string; isGood: boolean; severity: 'green' | 'orange' | 'red' } {
  const { outcome, data, errorMessage } = result;
  const created = data?.createdCount ?? 0;
  const updated = data?.updatedCount ?? 0;
  const skipped = data?.skippedCount ?? 0;
  const succeeded = created + updated;

  if (outcome === 'full') {
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

//Bulk upload of employee function works here , call the helper function
async function parseBulkUploadFile(file: File): Promise<BulkEmployeeRow[]> {
  const raw = await parseSpreadsheetFile(file);
  return raw.map(toRow);
}

const EMAIL_FIELDS = new Set(['email', 'reportingManagerEmail', 'skipLevel1ManagerEmail', 'skipLevel2ManagerEmail']);
const ACTIVE_JOB_STORAGE_KEY = 'bulkImport.activeJobId';

export default function BulkImportWizard() {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<ValidatedBulkEmployeeRow[] | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitResult, setCommitResult] = useState<CommitResult | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  const { job: uploadJob } = useBulkUploadJobPolling(activeJobId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialMountRef = useRef(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isResumedJob = !!activeJobId && !file;

  // Close template download dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDownloadDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      try {
        const stored = sessionStorage.getItem(ACTIVE_JOB_STORAGE_KEY);
        if (stored && stored !== activeJobId) {
          setActiveJobId(stored);
          return;
        }
      } catch { }
    }
    try {
      if (activeJobId) sessionStorage.setItem(ACTIVE_JOB_STORAGE_KEY, activeJobId);
      else sessionStorage.removeItem(ACTIVE_JOB_STORAGE_KEY);
    } catch { }
  }, [activeJobId]);

  const serverErrorsByRowIdRef = useRef<Record<string, string>>({});
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

  const handleRowEdit = useCallback((
    rowId: string,
    field: 'employeeCode' | 'name' | 'email' | 'mobile' | 'placeOfPosting' | 'designation' | 'department' | 'reportingManagerEmail' | 'skipLevel1ManagerEmail' | 'skipLevel2ManagerEmail',
    value: string
  ) => {
    const normalizedValue = EMAIL_FIELDS.has(field) ? value.trim().toLowerCase() : value;
    delete serverErrorsByRowIdRef.current[rowId];

    setPreviewRows((prev) => {
      if (!prev) return prev;
      return prev.map((row) => (row._rowId === rowId ? { ...row, [field]: normalizedValue } : row));
    });

    if (revalidateTimeoutRef.current) clearTimeout(revalidateTimeoutRef.current);
    revalidateTimeoutRef.current = setTimeout(() => {
      setPreviewRows((prev) => (prev ? applyServerErrors(validateBulkEmployeeRows(prev)) : prev));
    }, 250);
  }, [applyServerErrors]);

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
      const csvFile = rowsToCsvFile(previewRows, file.name);
      const { jobId } = await userService.batchCreateUsersAsync(csvFile);
      if (!jobId) throw new Error(t('bulkImport.results.noJobIdReturned'));
      setActiveJobId(jobId);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || t('bulkImport.results.failureDescription');
      console.error(t('bulkImport.results.startFailedLog'), err);
      setCommitResult({ outcome: 'requestFailed', errorMessage });
      toast.error(errorMessage);
      setShowSuccessModal(true);
      setIsCommitting(false);
    }
  }, [file, previewRows]);

  useEffect(() => {
    if (!uploadJob || !isTerminal(uploadJob.status)) return;
    try {
      if (uploadJob.status === 'failed') {
        const errorMessage = uploadJob.error || t('bulkImport.results.failureDescription');
        setCommitResult({ outcome: 'requestFailed', errorMessage });
        toast.error(errorMessage);
      } else {
        const data: BatchCreateResponse = {
          createdCount: uploadJob.createdCount,
          updatedCount: uploadJob.updatedCount,
          skippedCount: uploadJob.skippedCount,
          skippedEmails: uploadJob.skippedEmails,
          skipped: uploadJob.skipped,
        };
        const succeededCount = data.createdCount + data.updatedCount;
        const outcome: CommitOutcome = data.skippedCount === 0 ? 'full' : succeededCount > 0 ? 'partial' : 'allSkipped';
        const result: CommitResult = { outcome, data };
        setCommitResult(result);

        const { description, severity } = getOutcomeMessage(result);
        if (severity === 'green') toast.success(description);
        else if (severity === 'orange') toast.warning(description);
        else toast.error(description);
      }
    } finally {
      setShowSuccessModal(true);
      setIsCommitting(false);
      setActiveJobId(null);
    }
  }, [uploadJob]);

  const handleDone = useCallback(() => {
    setShowSuccessModal(false);
    handleRemoveFile();
  }, [handleRemoveFile]);

  const handleFixSkippedRows = useCallback(() => {
    const skipped = commitResult?.data?.skipped;
    if (skipped && skipped.length > 0) {
      const errorByCode = new Map(
        skipped.filter((s) => s.employeeCode).map((s) => [s.employeeCode!, s.error])
      );
      const errorByEmail = new Map(
        skipped.filter((s) => s.email).map((s) => [s.email!.toLowerCase(), s.error])
      );
      setPreviewRows((prev) => {
        if (!prev) return prev;
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

      {isResumedJob && (
        <div className="p-4 rounded-xl bg-bgStatCard border border-borderCard">
          <div className="flex items-center justify-between text-xs text-textSidebarMuted mb-2">
            <span>
              {uploadJob
                ? `Resuming a previously started upload… ${ uploadJob.processedRows }/${ uploadJob.totalRows } rows`
                : 'Checking on a previously started upload…'}
            </span>
            {uploadJob && <span>{uploadJob.progress}%</span>}
          </div>
          <Progress value={uploadJob?.progress ?? 0} className="h-2" />
        </div>
      )}

      {/* Step 1 — Download template in .csv, .xlsx, or .xls */}
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

          {/* Format Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDownloadDropdownOpen((prev) => !prev)}
              className="px-5 py-2 text-sm font-medium text-white bg-white/5 border border-white/10
                         rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
              id="download-template-btn"
            >
              <Download size={15} />
              <span>{t('bulkImport.template.downloadButton')}</span>
              <ChevronDown size={14} className={`transition-transform ${ isDownloadDropdownOpen ? 'rotate-180' : '' }`} />
            </button>

            {isDownloadDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-bgStatCard border border-borderCard shadow-xl z-20 overflow-hidden py-1">
                <button
                  onClick={() => {
                    downloadSampleTemplate('csv', BULK_EMPLOYEE_TEMPLATE_HEADERS, BULK_EMPLOYEE_SAMPLE_ROWS, 'employee_bulk_upload_template');
                    setIsDownloadDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center justify-between"
                >
                  <span>CSV File</span>
                  <span className="text-xs text-textSidebarMuted font-mono">.csv</span>
                </button>
                <button
                  onClick={() => {
                    downloadSampleTemplate('xlsx', BULK_EMPLOYEE_TEMPLATE_HEADERS, BULK_EMPLOYEE_SAMPLE_ROWS, 'employee_bulk_upload_template');
                    setIsDownloadDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center justify-between"
                >
                  <span>Excel Workbook</span>
                  <span className="text-xs text-textSidebarMuted font-mono">.xlsx</span>
                </button>
                <button
                  onClick={() => {
                    downloadSampleTemplate('xls', BULK_EMPLOYEE_TEMPLATE_HEADERS, BULK_EMPLOYEE_SAMPLE_ROWS, 'employee_bulk_upload_template');
                    setIsDownloadDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center justify-between"
                >
                  <span>Legacy Excel</span>
                  <span className="text-xs text-textSidebarMuted font-mono">.xls</span>
                </button>
              </div>
            )}
          </div>
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
                  Drop <span className="text-primary">.csv / .xlsx / .xls</span> file here or{' '}
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

      {/* Step 3 — Review preview rows */}
      {previewRows && file && (
        <div className="rounded-xl bg-bgStatCard border border-borderCard overflow-hidden">
          {isCommitting && (
            <div className="px-6 pt-5 pb-1">
              <div className="flex items-center justify-between text-xs text-textSidebarMuted mb-2">
                <span>
                  {uploadJob
                    ? `Uploading… ${ uploadJob.processedRows }/${ uploadJob.totalRows } rows`
                    : 'Starting upload…'}
                </span>
                {uploadJob && <span>{uploadJob.progress}%</span>}
              </div>
              <Progress value={uploadJob?.progress ?? 0} className="h-2" />
            </div>
          )}
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
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${ iconColor === 'green' ? 'bg-accentGreen/10 border-accentGreen/30'
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

              <h3 className={`text-lg font-semibold mb-3 ${ isGood ? 'text-white' : iconColor === 'orange' ? 'text-accentOrange' : 'text-accentRed' }`}>
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