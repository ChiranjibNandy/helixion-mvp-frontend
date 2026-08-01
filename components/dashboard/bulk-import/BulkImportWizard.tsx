'use client';

import { useRef, useState, useCallback } from 'react';
import { FileText, X } from 'lucide-react';
import { userService, BatchCreateResponse } from '@/services/userService';
import { formatFileSize } from '@/utils/csv-parser';
import { t } from '@/lib/i18n';
import FileDropzone from '@/components/shared/FileDropzone';
import PageHeader from '@/components/ui/pageHeader';

interface CommitResult {
  success: boolean;
  data?: BatchCreateResponse;
  errorMessage?: string;
}

// Matches the backend's new CSV column set (helixion-mvp-backend
// batchCreateUsersService — the columns are human-readable, not
// machine-friendly keys, so header text must match exactly).
const CSV_TEMPLATE = `Employee Roll No.,Name of the employee,Email,Mobile,Place of Posting,Designation,Department,Training Department Junior Officer,Training Department Senior Officer,OSD Team Junior Officer,OSD Team Senior Officer,Reporting Manager Email,Skip Level 1 Manager Email,Skip Level 2 Manager Email
E1001,Arjun Mehta,arjun@corp.in,9876543210,Mumbai,Analyst,Finance,No,No,No,No,manager@corp.in,,
E1002,Sara Iyer,sara@corp.in,9876543211,Delhi,Senior Analyst,Finance,Yes,No,No,No,manager@corp.in,skiplevel1@corp.in,`;

export default function BulkImportWizard() {
  const [file, setFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitResult, setCommitResult] = useState<CommitResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = useCallback((selected: File) => {
    setFile(selected);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setCommitResult(null);
  }, []);

  const handleConfirmCommit = useCallback(async () => {
    if (!file) return;
    setIsCommitting(true);
    setShowConfirmModal(false);

    try {
      const data = await userService.batchCreateUsers(file);
      setCommitResult({ success: true, data });
    } catch (err: any) {
      setCommitResult({
        success: false,
        errorMessage: err?.response?.data?.message || t('bulkImport.results.failureDescription'),
      });
    } finally {
      setShowSuccessModal(true);
      setIsCommitting(false);
    }
  }, [file]);

  const handleDone = useCallback(() => {
    setShowSuccessModal(false);
    handleRemoveFile();
  }, [handleRemoveFile]);

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

      {/* Step 2 — Upload file */}
      <div>
        <p className="text-xs text-textSidebarMuted mb-3">{t('bulkImport.upload.stepLabel')}</p>

        {!file ? (
          <FileDropzone
            accept=".csv"
            isProcessing={false}
            label={
              <>
                Drop <span className="text-primary">.csv</span> file here or{' '}
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
                <p className="text-xs text-textSidebarMuted">{formatFileSize(file.size)}</p>
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
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primaryDark transition-all duration-200"
              >
                Upload
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-bgStatCard border border-borderCard rounded-2xl p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-accentOrange/10 border border-accentOrange/30 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="13" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1" fill="#f59e0b" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">{t('bulkImport.confirm.title')}</h3>
            <p className="text-sm text-textSidebarMuted leading-relaxed">
              This will process every row in <span className="text-white/80">{file?.name}</span> — creating
              new employees and updating existing ones by email. {t('bulkImport.confirm.auditNote')}
            </p>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 text-sm text-white/70 bg-white/5 border border-white/10
                           rounded-lg hover:bg-white/10 transition-all duration-200"
                id="confirm-cancel-btn"
              >
                {t('bulkImport.confirm.cancelButton')}
              </button>
              <button
                onClick={handleConfirmCommit}
                disabled={isCommitting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary
                           rounded-lg hover:bg-primaryDark transition-all duration-200 disabled:opacity-50"
                id="confirm-commit-btn"
              >
                {isCommitting ? t('bulkImport.upload.processing') : t('bulkImport.confirm.confirmButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showSuccessModal && commitResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-bgStatCard border border-borderCard rounded-2xl p-8 shadow-2xl">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${
              commitResult.success ? 'bg-accentGreen/10 border-accentGreen/30' : 'bg-accentRed/10 border-accentRed/30'
            }`}>
              {commitResult.success ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="2" />
                  <path d="M8 12.5L11 15.5L16 9.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2" />
                  <path d="M15 9L9 15M9 9L15 15" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>

            <h3 className={`text-lg font-semibold mb-3 ${commitResult.success ? 'text-white' : 'text-accentRed'}`}>
              {commitResult.success ? t('bulkImport.results.successTitle') : t('bulkImport.results.failureTitle')}
            </h3>

            {commitResult.success ? (
              <p className="text-sm text-textSidebarMuted leading-relaxed mb-4">
                {t('bulkImport.results.successDescription', { count: commitResult.data?.createdCount ?? 0 })}
              </p>
            ) : (
              <p className="text-sm text-textSidebarMuted leading-relaxed mb-4">
                {commitResult.errorMessage || t('bulkImport.results.failureDescription')}
              </p>
            )}

            {commitResult.success && commitResult.data && (
              <div className="flex items-center gap-2 text-sm mb-8">
                {commitResult.data.createdCount > 0 && (
                  <span className="text-accentGreen">
                    {t('bulkImport.results.approved', { count: commitResult.data.createdCount })}
                  </span>
                )}
                {commitResult.data.createdCount > 0 && commitResult.data.updatedCount > 0 && (
                  <span className="text-textSidebarMuted">·</span>
                )}
                {commitResult.data.updatedCount > 0 && (
                  <span className="text-accentOrange">
                    {t('bulkImport.results.roleUpdated', { count: commitResult.data.updatedCount })}
                  </span>
                )}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleDone}
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary
                           rounded-lg hover:bg-primaryDark transition-all duration-200"
                id="success-done-btn"
              >
                {t('bulkImport.results.doneButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
