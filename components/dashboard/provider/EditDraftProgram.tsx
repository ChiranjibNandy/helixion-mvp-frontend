'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Paperclip, Save, Send } from 'lucide-react';
import { useDraftActions } from '@/hooks/useDraftActions';
import { t } from '@/lib/i18n';
import Badge from '@/components/ui/badge';
import AppModal from '@/components/ui/app-modal';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import InputField from '@/components/ui/input';
import { formatUpdatedAt, shortDraftId, getStayOptionPrice } from '@/utils/formatters';
import StayTypeFees from './StayTypeFees';
import type { UpdateDraftPayload } from '@/services/provider.service';

interface EditDraftProgramProps {
  programId: string;
}

export default function EditDraftProgram({ programId }: EditDraftProgramProps) {
  const router = useRouter();
  const { draft, isLoadingDraft, isSaving, isPublishing, fetchDraft, saveDraft, publishDraft } = useDraftActions();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // ── Form state ─────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [isResidential, setIsResidential] = useState(false);
  const [singleOccupancyFee, setSingleOccupancyFee] = useState('');
  const [twinSharingFee, setTwinSharingFee] = useState('');
  const [isNonResidential, setIsNonResidential] = useState(false);
  const [nonResidentialFee, setNonResidentialFee] = useState('');
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [brochureFilename, setBrochureFilename] = useState('');

  useEffect(() => { fetchDraft(programId); }, [programId]);

  useEffect(() => {
    if (!draft) return;
    setTitle(draft.title || '');
    setStartDate(draft.startDate ? draft.startDate.split('T')[0] : '');
    setEndDate(draft.endDate ? draft.endDate.split('T')[0] : '');
    setVenue(draft.venueName || '');
    setCity(draft.city || '');
    const singleOccupancyFeeValue = getStayOptionPrice(draft.stayOptions, 'single_occupancy');
    const twinSharingFeeValue = getStayOptionPrice(draft.stayOptions, 'twin_sharing');
    const nonResidentialFeeValue = getStayOptionPrice(draft.stayOptions, 'non_residential');
    const hasRes = !!singleOccupancyFeeValue || !!twinSharingFeeValue;
    setIsResidential(hasRes);
    setSingleOccupancyFee(singleOccupancyFeeValue ? String(singleOccupancyFeeValue) : '');
    setTwinSharingFee(twinSharingFeeValue ? String(twinSharingFeeValue) : '');
    setIsNonResidential(!!nonResidentialFeeValue);
    setNonResidentialFee(nonResidentialFeeValue ? String(nonResidentialFeeValue) : '');
    if (draft.brochureUrl) {
      const parts = draft.brochureUrl.split('/');
      setBrochureFilename(parts[parts.length - 1] || 'brochure.pdf');
    }
  }, [draft]);

  const buildPayload = (): UpdateDraftPayload => ({
    title,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    venue: venue || undefined,
    city: city || undefined,
    singleOccupancyFee: isResidential && singleOccupancyFee ? Number(singleOccupancyFee) : undefined,
    twinSharingFee: isResidential && twinSharingFee ? Number(twinSharingFee) : undefined,
    nonResidentialFee: isNonResidential && nonResidentialFee ? Number(nonResidentialFee) : undefined,
  });

  const handleSaveDraft = async () => {
    const saved = await saveDraft(programId, buildPayload(), brochureFile || undefined);
    if (saved) {
      router.push('/dashboard/programs/drafts');
    }
  };

  const handlePublishConfirm = async () => {
    setPublishError(null);
    const saved = await saveDraft(programId, buildPayload(), brochureFile || undefined);
    if (!saved) return;
    const result = await publishDraft(programId);
    if (result.success) {
      setShowPublishModal(false);
      router.push('/dashboard');
    } else {
      setPublishError(result.error || t('draftPrograms.errorPublishDefault'));
    }
  };

  const handlePublishCancel = () => {
    setShowPublishModal(false);
    setPublishError(null);
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setBrochureFile(file); setBrochureFilename(file.name); }
  };

  const handleBack = () => router.push('/dashboard/programs/drafts');




  if (isLoadingDraft) {
    return <div className="flex justify-center items-center py-16"><Spinner size="lg" /></div>;
  }

  if (!draft) return null;

  return (
    <div className="w-full flex flex-col text-white font-sans">
      {/* Publish Modal */}
      <AppModal isOpen={showPublishModal} type="confirm"
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
        loading={isPublishing || isSaving}
        onCancel={handlePublishCancel} onConfirm={handlePublishConfirm} />

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleBrochureChange} accept=".pdf" className="hidden" />

      {/* Back Link */}
      <Button variant="ghost" onClick={handleBack} className="mb-4 self-start" id="back-to-drafts">
        <ArrowLeft size={16} className="mr-1.5" />
        {t('draftPrograms.backToDrafts')}
      </Button>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 mb-1">{t('draftPrograms.editPageTitle')}</h1>
          <p className="text-sm text-white/40">
            {t('draftPrograms.editDraftId', { id: shortDraftId(draft._id) })} · {t('draftPrograms.editLastUpdated', { date: formatUpdatedAt(draft.updatedAt) })}
          </p>
        </div>
        <Badge status="draft">{t('draftPrograms.statusDraft')}</Badge>
      </div>

      {/* Form Card */}
      <div className="border border-white/[0.08] rounded-xl p-8 mb-6">
        <h3 className="text-base font-semibold text-slate-200 mb-1">{t('draftPrograms.programDetails')}</h3>
        <p className="text-xs text-white/35 mb-6">{t('draftPrograms.fieldsRequired')}</p>

        {/* Program Title */}
        <div className="grid grid-cols-[180px_1fr] items-start py-5 border-t border-white/[0.06] gap-4">
          <label className="text-sm font-medium text-white/70 pt-2">
            {t('draftPrograms.labelProgramTitle')}<span className="text-red-400 ml-1">*</span>
          </label>
          <InputField value={title} onChange={(e) => setTitle(e.target.value)} id="edit-program-title" />
        </div>

        {/* Program Dates */}
        <div className="grid grid-cols-[180px_1fr] items-start py-5 border-t border-white/[0.06] gap-4">
          <label className="text-sm font-medium text-white/70 pt-2">
            {t('draftPrograms.labelProgramDates')}<span className="text-red-400 ml-1">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-white/35 font-medium">{t('draftPrograms.labelStartDate')}</span>
              <InputField type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} id="edit-start-date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-white/35 font-medium">{t('draftPrograms.labelEndDate')}</span>
              <InputField type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} id="edit-end-date" />
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className="grid grid-cols-[180px_1fr] items-start py-5 border-t border-white/[0.06] gap-4">
          <label className="text-sm font-medium text-white/70 pt-2">
            {t('draftPrograms.labelVenue')}<span className="text-red-400 ml-1">*</span>
          </label>
          <InputField value={venue} onChange={(e) => setVenue(e.target.value)} id="edit-venue" />
        </div>

        {/* City — drives local-vs-outstation travel notifications */}
        <div className="grid grid-cols-[180px_1fr] items-start py-5 border-t border-white/[0.06] gap-4">
          <label className="text-sm font-medium text-white/70 pt-2">
            {t('draftPrograms.labelCity')}
          </label>
          <InputField value={city} onChange={(e) => setCity(e.target.value)} id="edit-city" />
        </div>

        {/* Stay Type & Fees */}
        <StayTypeFees
          isResidential={isResidential}
          setIsResidential={setIsResidential}
          singleOccupancyFee={singleOccupancyFee}
          setSingleOccupancyFee={setSingleOccupancyFee}
          twinSharingFee={twinSharingFee}
          setTwinSharingFee={setTwinSharingFee}
          isNonResidential={isNonResidential}
          setIsNonResidential={setIsNonResidential}
          nonResidentialFee={nonResidentialFee}
          setNonResidentialFee={setNonResidentialFee}
        />

        {/* Attach Brochure */}
        <div className="grid grid-cols-[180px_1fr] items-start py-5 border-t border-white/[0.06] gap-4">
          <label className="text-sm font-medium text-white/70 pt-2">
            {t('draftPrograms.labelAttachBrochure')}<span className="text-red-400 ml-1">*</span>
          </label>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} id="browse-brochure">
                <Paperclip size={14} className="mr-1.5" />{t('draftPrograms.browseButton')}
              </Button>
              {brochureFilename && <span className="text-sm text-white/60">{brochureFilename}</span>}
            </div>
            <p className="text-[11px] text-white/30 mt-1">{t('draftPrograms.brochureHint')}</p>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end items-center pt-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving || isPublishing} id="save-draft-button">
            <Save size={14} className="mr-1.5" />{isSaving ? t('draftPrograms.saving') : t('draftPrograms.saveDraftButton')}
          </Button>
          <Button variant="default" onClick={() => setShowPublishModal(true)} disabled={isSaving || isPublishing} id="publish-program-button">
            <Send size={14} className="mr-1.5" />{t('draftPrograms.publishProgramButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
