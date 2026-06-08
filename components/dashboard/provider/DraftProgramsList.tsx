'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDraftPrograms } from '@/hooks/useDraftPrograms';
import { useDraftActions } from '@/hooks/useDraftActions';
import { t } from '@/lib/i18n';
import { formatDate, formatUpdatedAt } from '@/utils/formatters';
import Badge from '@/components/ui/badge';
import SearchInput from '@/components/ui/search-input';
import AppModal from '@/components/ui/app-modal';
import { Spinner } from '@/components/ui/spinner';
import PaginationController from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import DraftActions from './DraftActions';
import type { DraftProgram } from '@/types';
import { DataTable } from '@/components/shared/data-table';

export default function DraftProgramsList() {
  const router = useRouter();
  const { drafts, total, page, isLoading, search, setSearch, setPage, refresh } = useDraftPrograms();
  const { publishDraft, deleteDraft, isPublishing, isDeleting } = useDraftActions();

  const [publishTarget, setPublishTarget] = useState<DraftProgram | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DraftProgram | null>(null);

  const perPage = 10;
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const handleEdit = (id: string) => router.push(`/dashboard/programs/drafts/${id}`);

  const handlePublishConfirm = async () => {
    if (!publishTarget) return;
    setPublishError(null);
    const result = await publishDraft(publishTarget._id);
    if (result.success) { 
      setPublishTarget(null); 
      refresh(); 
    } else {
      setPublishError(result.error || t('draftPrograms.errorPublishDefault'));
    }
  };

  const handlePublishCancel = () => {
    setPublishTarget(null);
    setPublishError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const ok = await deleteDraft(deleteTarget._id);
    if (ok) { setDeleteTarget(null); refresh(); }
  };

  const fmtFee = (p: DraftProgram) => {
    const parts = [];
    if (p.singleOccupancyFee) parts.push(t('draftPrograms.feeSingle', { fee: p.singleOccupancyFee.toLocaleString('en-IN') }));
    if (p.twinSharingFee) parts.push(t('draftPrograms.feeTwin', { fee: p.twinSharingFee.toLocaleString('en-IN') }));
    if (p.nonResidentialFee) parts.push(t('draftPrograms.feeNonRes', { fee: p.nonResidentialFee.toLocaleString('en-IN') }));
    
    if (parts.length === 0) return <span className="text-sm font-medium text-white/80">—</span>;
    
    return (
      <div className="flex flex-col gap-1">
        {parts.map((part, i) => (
          <span key={i} className="text-[11px] font-medium text-white/80 bg-white/5 px-2 py-0.5 rounded w-max">
            {part}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col text-white font-sans">
      {/* Publish Modal */}
      <AppModal isOpen={!!publishTarget} type="confirm"
        title={t('draftPrograms.publishModalTitle')}
        description={
          <div className="flex flex-col gap-2">
            <span>{t('draftPrograms.publishModalDescription')}</span>
            {publishError && (
              <span className="text-red-400 font-medium text-xs mt-1 p-2 bg-red-500/10 rounded border border-red-500/20">
                {publishError}
              </span>
            )}
          </div>
        }
        cancelLabel={t('draftPrograms.publishModalDisagree')}
        confirmLabel={t('draftPrograms.publishModalConfirm')}
        loading={isPublishing}
        onCancel={handlePublishCancel} onConfirm={handlePublishConfirm} />

      {/* Delete Modal */}
      <AppModal isOpen={!!deleteTarget} type="confirm"
        title={t('draftPrograms.deleteModalTitle')}
        description={t('draftPrograms.deleteModalDescription')}
        cancelLabel={t('draftPrograms.deleteModalCancel')}
        confirmLabel={t('draftPrograms.deleteModalConfirm')}
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} />

      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-slate-100">{t('draftPrograms.pageTitle')}</h1>
          <p className="text-[10px] text-white/40 tracking-wider font-semibold uppercase">{t('draftPrograms.breadcrumb')}</p>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 mb-0.5">{t('draftPrograms.sectionTitle')}</h2>
          <p className="text-xs text-white/45">{t('draftPrograms.sectionDescription')}</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder={t('draftPrograms.searchPlaceholder')} />
          <Button
            onClick={() => router.push('/dashboard/programs/create')} id="new-program-button">
            {t('draftPrograms.newProgramButton')}
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16"><Spinner size="lg" /></div>
      ) : drafts.length === 0 ? (
        <div className="bg-[#111827] border border-white/[0.06] rounded-xl">
          <div className="text-center py-12 text-white/40 text-sm">{t('draftPrograms.noResults')}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <DataTable 
            data={drafts} 
            columns={[
              {
                key:"title",
                header: t('draftPrograms.columnProgramTitle'),
                render: (p: DraftProgram) => (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-slate-200">{p.title}</span>
                    <span className="text-[11px] text-white/35">{t('draftPrograms.lastUpdated')} {formatUpdatedAt(p.updatedAt)}</span>
                  </div>
                )
              },
              {
                key:"startDate",
                header: t('draftPrograms.columnStartDate'),
                render: (p: DraftProgram) => <span className="text-sm text-white/70">{formatDate(p.startDate)}</span>
              },
              {
                key:"endDate",
                header: t('draftPrograms.columnEndDate'),
                render: (p: DraftProgram) => <span className="text-sm text-white/70">{formatDate(p.endDate)}</span>
              },
              {
                key:"venue",
                header: t('draftPrograms.columnVenue'),
                render: (p: DraftProgram) => <span className="text-sm text-white/70">{p.venue || '—'}</span>
              },
              {
                key:"fee",
                header: t('draftPrograms.columnFee'),
                render: (p: DraftProgram) => fmtFee(p)
              },
              {
                key:"status",
                header: t('draftPrograms.columnStatus'),
                render: (p: DraftProgram) => <Badge status="draft">{t('draftPrograms.statusDraft')}</Badge>
              },
              {
                key:"action",
                header: t('draftPrograms.columnActions'),
                render: (p: DraftProgram) => (
                  <DraftActions
                    program={p}
                    onEdit={handleEdit}
                    onPublish={setPublishTarget}
                    onDelete={setDeleteTarget}
                  />
                )
              }
            ]}
          />

          {/* Pagination Footer */}
          {total > 0 && (
            <div className="flex flex-col items-center justify-center mt-2 mb-4">
              <PaginationController 
                page={page} 
                totalPages={Math.ceil(total / perPage)} 
                onPageChange={setPage} 
              />
              <div className="text-xs text-white/40 mt-3">
                {t('draftPrograms.paginationInfo', { start, end, total })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
