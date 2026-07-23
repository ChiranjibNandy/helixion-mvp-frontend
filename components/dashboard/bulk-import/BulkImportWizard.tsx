'use client';

import { useState, useCallback } from 'react';
import { BulkUser, ImportResults } from '@/types/bulk-import';
import { userService } from '@/services/userService';
import { t } from '@/lib/i18n';
import StepUpload from './StepUpload';
import StepReview from './StepReview';
import PageHeader from '@/components/ui/pageHeader';

export default function BulkImportWizard() {
  const [parsedUsers, setParsedUsers] = useState<BulkUser[]>([]);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileRows, setFileRows] = useState(0);
  const [hasFile, setHasFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitResults, setCommitResults] = useState<ImportResults | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx'>('csv');

  const handleFileParsed = useCallback((users: BulkUser[], name: string, size: string, rows: number) => {
    setParsedUsers(users);
    setFileName(name);
    setFileSize(size);
    setFileRows(rows);
    setHasFile(true);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setParsedUsers([]);
    setFileName('');
    setFileSize('');
    setFileRows(0);
    setHasFile(false);
    setCommitResults(null);
  }, []);

  const validRows = parsedUsers.filter((u) => u.status === 'Valid');
  const errorRows = parsedUsers.filter((u) => u.status === 'Error');
  const warningRows = parsedUsers.filter((u) => u.status === 'Warning');
  const skippedRows = errorRows.length;

  const handleCommitClick = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirmCommit = useCallback(async () => {
    setIsCommitting(true);
    setShowConfirmModal(false);

    try {
      const payload = [...validRows, ...warningRows].map((u) => ({
        email: u.email,
        role: u.role || 'employee',
        action: u.action,
      }));

      if (payload.length === 0) {
        throw new Error(t('bulkImport.results.noValidUsers'));
      }

      const data = await userService.batchCreateUsers(payload);

      setCommitResults({
        success: true,
        totalSubmitted: parsedUsers.length,
        createdCount: data?.createdCount || 0,
        approvedCount: data?.createdCount || 0,
        roleUpdatedCount: data?.updatedCount || 0,
        skippedCount: data?.skippedCount || 0,
      });
      setShowSuccessModal(true);
    } catch {
      setCommitResults({
        success: false,
        totalSubmitted: parsedUsers.length,
        createdCount: 0,
        errorMessage: t('bulkImport.results.failureDescription'),
      });
      setShowSuccessModal(true);
    } finally {
      setIsCommitting(false);
    }
  }, [parsedUsers, validRows, warningRows, skippedRows]);

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
        title={t("bulkImport.header.title")}
        description={t("bulkImport.header.description")}
      />

      {/* Supported Formats */}
      <div>
        <p className="text-xs text-textSidebarMuted mb-3">{t('bulkImport.formats.label')}</p>
        <div className="grid grid-cols-2 gap-3">
          {/* CSV Card */}
          <div
            onClick={() => setSelectedFormat('csv')}
            className={`flex items-center gap-3 p-4 rounded-xl bg-bgStatCard cursor-pointer transition-all ${ selectedFormat === 'csv' ? 'border-2 border-primary' : 'border border-borderCard opacity-80 hover:opacity-100'
              }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#16a34a]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-[#16a34a] tracking-wider">CSV</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{t('bulkImport.formats.csv')}</p>
              <p className="text-xs text-textSidebarMuted mt-0.5">{t('bulkImport.formats.csvDescription')}</p>
            </div>
            <span className="text-[10px] font-medium text-[#16a34a] border border-[#16a34a]/30 bg-[#16a34a]/10 px-2 py-0.5 rounded">
              {t('bulkImport.formats.enabled')}
            </span>
          </div>

          {/* XLSX Card */}
          <div
            onClick={() => setSelectedFormat('xlsx')}
            className={`flex items-center gap-3 p-4 rounded-xl bg-bgStatCard cursor-pointer transition-all ${ selectedFormat === 'xlsx' ? 'border-2 border-primary' : 'border border-borderCard opacity-60 hover:opacity-80'
              }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#16a34a]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-[#16a34a] tracking-wider">XLS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{t('bulkImport.formats.xlsx')}</p>
              <p className="text-xs text-textSidebarMuted mt-0.5">{t('bulkImport.formats.xlsxDescription')}</p>
            </div>
            <span className="text-[10px] font-medium text-textSidebarMuted border border-white/10 bg-white/5 px-2 py-0.5 rounded">
              {t('bulkImport.formats.paidPlan')}
            </span>
          </div>
        </div>
      </div>

      {selectedFormat === 'xlsx' ? (
        <div className="p-4 rounded-xl bg-accentOrange/10 border border-accentOrange/20">
          <p className="text-sm font-medium text-accentOrange">{t('bulkImport.formats.paidPlanTitle')}</p>
          <p className="text-xs text-accentOrange/80 mt-1">
            {t('bulkImport.formats.paidPlanDescription')}
          </p>
        </div>
      ) : (
        <>
          {/* Step 1 — Download template */}
          <div>
            <p className="text-xs text-textSidebarMuted mb-3">{t('bulkImport.template.stepLabel')}</p>
            <div className="flex items-center justify-between p-4 rounded-xl bg-bgStatCard border border-borderCard">
              <div>
                <p className="text-sm font-medium text-white">{t('bulkImport.template.fileName')}</p>
                <p className="text-xs text-textSidebarMuted mt-1">
                  {t('bulkImport.template.description')}
                </p>
              </div>
              <button
                onClick={() => {
                  const template = `email,role,action\narjun@email.com,employee,approve\nsara@trainpro.io,training_provider,approve\nvikram@corp.in,employee,update`;
                  const blob = new Blob([template], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'roles_import_template.csv';
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

            {!hasFile ? (
              <StepUpload onFileParsed={handleFileParsed} />
            ) : (
              <StepReview
                users={parsedUsers}
                fileName={fileName}
                fileSize={fileSize}
                fileRows={fileRows}
                validCount={validRows.length}
                errorCount={errorRows.length}
                warningCount={warningRows.length}
                skippedCount={skippedRows}
                isCommitting={isCommitting}
                onRemove={handleRemoveFile}
                onReUpload={handleRemoveFile}
                onCommit={handleCommitClick}
              />
            )}
          </div>
        </>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-bgStatCard border border-borderCard rounded-2xl p-8 shadow-2xl">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-accentOrange/10 border border-accentOrange/30 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="13" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1" fill="#f59e0b" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">{t('bulkImport.confirm.title')}</h3>
            <p className="text-sm text-textSidebarMuted leading-relaxed">
              {t('bulkImport.confirm.description', { count: validRows.length })}
              {skippedRows > 0 && ` ${ t('bulkImport.confirm.skippedNote', { count: skippedRows }) }`}
              {' '}{t('bulkImport.confirm.auditNote')}
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
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary
                           rounded-lg hover:bg-primaryDark transition-all duration-200"
                id="confirm-commit-btn"
              >
                {t('bulkImport.confirm.confirmButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showSuccessModal && commitResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-bgStatCard border border-borderCard rounded-2xl p-8 shadow-2xl">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${ commitResults.success ? 'bg-accentGreen/10 border-accentGreen/30' : 'bg-accentRed/10 border-accentRed/30'
              }`}>
              {commitResults.success ? (
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

            <h3 className={`text-lg font-semibold mb-3 ${ commitResults.success ? 'text-white' : 'text-accentRed' }`}>
              {commitResults.success ? t('bulkImport.results.successTitle') : t('bulkImport.results.failureTitle')}
            </h3>

            {commitResults.success ? (
              <p className="text-sm text-textSidebarMuted leading-relaxed mb-4">
                {t('bulkImport.results.successDescription', { count: commitResults.createdCount })}
              </p>
            ) : (
              <p className="text-sm text-textSidebarMuted leading-relaxed mb-4">
                {commitResults.errorMessage || t('bulkImport.results.failureDescription')}
              </p>
            )}

            {/* Stats line */}
            {commitResults.success && (
              <div className="flex items-center gap-2 text-sm mb-8">
                {(commitResults.approvedCount ?? 0) > 0 && (
                  <span className="text-accentGreen">
                    {t('bulkImport.results.approved', { count: commitResults.approvedCount ?? 0 })}
                  </span>
                )}
                {(commitResults.approvedCount ?? 0) > 0 && ((commitResults.roleUpdatedCount ?? 0) > 0 || (commitResults.skippedCount ?? 0) > 0) && (
                  <span className="text-textSidebarMuted">·</span>
                )}
                {(commitResults.roleUpdatedCount ?? 0) > 0 && (
                  <span className="text-accentOrange">
                    {t('bulkImport.results.roleUpdated', { count: commitResults.roleUpdatedCount ?? 0 })}
                  </span>
                )}
                {(commitResults.roleUpdatedCount ?? 0) > 0 && (commitResults.skippedCount ?? 0) > 0 && (
                  <span className="text-textSidebarMuted">·</span>
                )}
                {(commitResults.skippedCount ?? 0) > 0 && (
                  <span className="text-textSidebarMuted">
                    {t('bulkImport.results.skipped', { count: commitResults.skippedCount ?? 0 })}
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
