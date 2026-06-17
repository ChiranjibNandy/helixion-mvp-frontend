'use client';

import { Loader2 } from 'lucide-react';
import { BulkUser } from '@/types/bulk-import';
import DataTable from '@/components/shared/data-table';
import { t } from '@/lib/i18n';
import { StatusBadge } from '@/components/shared/StatusBadge';

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

/**
 * Build the column definitions for the review DataTable.
 */
function getReviewColumns() {
  return [
    {
      key: 'row',
      header: t('bulkImport.review.columnRow'),
      render: (_: BulkUser, idx?: number) => (
        <span className="text-xs text-textSidebarMuted">{(idx ?? 0) + 1}</span>
      ),
    },
    {
      key: 'email',
      header: t('bulkImport.review.columnEmail'),
      render: (user: BulkUser) => (
        <span className={`text-xs ${user.status === 'Error' ? 'text-white/40 line-through' : 'text-white'}`}>
          {user.email}
        </span>
      ),
    },
    {
      key: 'role',
      header: t('bulkImport.review.columnRole'),
      render: (user: BulkUser) => (
        <StatusBadge status={user.role || 'employee'} />
      ),
    },
    {
      key: 'action',
      header: t('bulkImport.review.columnAction'),
      render: (user: BulkUser) => (
        <StatusBadge status={user.action} />
      ),
    },
    {
      key: 'status',
      header: t('bulkImport.review.columnStatus'),
      render: (user: BulkUser) => (
        <StatusBadge status={user.status} />
      ),
    },
    {
      key: 'note',
      header: t('bulkImport.review.columnNote'),
      render: (user: BulkUser) => {
        const colorMap = {
          Error: 'text-accentRed',
          Warning: 'text-accentOrange',
          Valid: 'text-textSidebarMuted',
        };
        return (
          <span className={`text-[11px] ${colorMap[user.status]}`}>{user.note}</span>
        );
      },
    },
  ];
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
  const columns = getReviewColumns();

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
          {t('bulkImport.review.removeButton')}
        </button>
      </div>

      {/* Preview Table Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-textSidebarMuted">{t('bulkImport.review.previewLabel')}</p>
        <div className="flex items-center gap-3">
          {validCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#16a34a]/10 border border-[#16a34a]/20">
              <span className="text-[10px] font-medium text-[#16a34a]">
                {t('bulkImport.review.valid', { count: validCount })}
              </span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accentRed/10 border border-accentRed/20">
              <span className="text-[10px] font-medium text-accentRed">
                {t('bulkImport.review.error', { count: errorCount })}
              </span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accentOrange/10 border border-accentOrange/20">
              <span className="text-[10px] font-medium text-accentOrange">
                {t('bulkImport.review.warning', { count: warningCount })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Table using DataTable */}
      <div className="bg-bgStatCard rounded-xl border border-borderCard overflow-hidden">
        <DataTable data={users} columns={columns} />

        <div className="px-5 py-2 text-xs text-textSidebarMuted bg-white/[0.01] border-t border-white/5">
          {t('bulkImport.review.footerInfo')}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-5 border-t border-white/5">
          <div className="text-sm">
            <span className="text-textSidebarMuted">{t('bulkImport.review.committing')} </span>
            <span className="text-white font-medium">
              {t('bulkImport.review.validRows', { count: validCount })}
            </span>
            {skippedCount > 0 && (
              <>
                <span className="text-textSidebarMuted"> · </span>
                <span className="text-accentRed font-medium">
                  {t('bulkImport.review.skipped', { count: skippedCount })}
                </span>
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
              {t('bulkImport.review.reUploadButton')}
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
                  {t('bulkImport.review.committingButton')}
                </>
              ) : (
                t('bulkImport.review.commitButton', { count: validCount })
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
