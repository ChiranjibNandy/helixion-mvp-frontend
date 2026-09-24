'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDraftActions } from '@/hooks/useDraftActions';
import { t } from '@/lib/i18n';
import AppModal from '@/components/ui/app-modal';
import { Spinner } from '@/components/ui/spinner';
import { formatUpdatedAt, shortDraftId, getStayOptionPrice } from '@/utils/formatters';
import type { UpdateDraftPayload } from '@/services/provider.service';
import BaseProgramForm from '../programs/BaseProgram';

interface EditDraftProgramProps {
  programId: string;
}

export default function EditDraftProgram({ programId }: EditDraftProgramProps) {
  const router = useRouter();
  const { draft, isLoadingDraft, isSaving, isPublishing, fetchDraft, saveDraft, publishDraft } = useDraftActions();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // ── Unified Form State to match BaseProgramForm expectations ─────────
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    venue: '',
    city: '',
    singleOccupancyFee: '',
    twinSharingFee: '',
    nonResidentialFee: '',
    stayTypes: [
      {
        id: 'residential',
        label: t('draftPrograms.labelResidential'),
        enabled: false,
        options: [
          { id: 'single_occupancy', label: t('programme.fields.singleOccupancy'), price: '' },
          { id: 'twin_sharing', label: t('programme.fields.twinSharing'), price: '' },
        ],
      },
      {
        id: 'non_residential',
        label: t('programme.fields.nonResidential'),
        enabled: false,
        options: [
          { id: 'non_residential', label: t('programme.fields.nonResidentialFee'), price: '' },
        ],
      },
    ],
    brochureFile: null as File | null,
    brochureFilename: '',
    minParticipants:0,
maxParticipants:0
  });

  useEffect(() => { fetchDraft(programId); }, [programId]);

  useEffect(() => {
    if (!draft) return;
    
    const singleOccupancyFeeValue = getStayOptionPrice(draft.stayOptions, 'single_occupancy');
    const twinSharingFeeValue = getStayOptionPrice(draft.stayOptions, 'twin_sharing');
    const nonResidentialFeeValue = getStayOptionPrice(draft.stayOptions, 'non_residential');
    
    const hasRes = !!singleOccupancyFeeValue || !!twinSharingFeeValue;
    const hasNonRes = !!nonResidentialFeeValue;

    let filename = '';
    if (draft.brochureUrl) {
      const parts = draft.brochureUrl.split('/');
      filename = parts[parts.length - 1] || 'brochure.pdf';
    }

    setForm((prev) => ({
      ...prev,
      title: draft.title || '',
      startDate: draft.startDate ? draft.startDate.split('T')[0] : '',
      endDate: draft.endDate ? draft.endDate.split('T')[0] : '',
      venue: draft.venueName || '',
      city: draft.city || '',
      brochureFilename: filename,
      stayTypes: [
        {
          id: 'residential',
          label: t('draftPrograms.labelResidential'),
          enabled: hasRes,
          options: [
            { id: 'single_occupancy', label: t('trainingEnrolment.programDetails.singleOccupancy'), price: singleOccupancyFeeValue ? String(singleOccupancyFeeValue) : '' },
            { id: 'twin_sharing', label: t('trainingEnrolment.programDetails.twinSharing'), price: twinSharingFeeValue ? String(twinSharingFeeValue) : '' },
          ],
        },
        {
          id: 'non_residential',
          label: t('programme.list.stayTypeNonResidential'),
          enabled: hasNonRes,
          options: [
            { id: 'non_residential', label: t('programme.list.dayScholar'), price: nonResidentialFeeValue ? String(nonResidentialFeeValue) : '' },
          ],
        },
      ],
      minParticipants:draft.minParticipants || 0,
      maxParticipants:draft.maxParticipants || 0
    }));
  }, [draft]);

  // Handle generic field changes
  const handleFieldChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle stay type checkboxes
  const toggleStayType = (stayId: string) => {
    setForm((prev) => ({
      ...prev,
      stayTypes: prev.stayTypes.map((stay) =>
        stay.id === stayId ? { ...stay, enabled: !stay.enabled } : stay
      ),
    }));
  };

  // Update option prices inside stay types
  const updateOptionPrice = (stayId: string, optionId: string, price: string) => {
    setForm((prev) => ({
      ...prev,
      stayTypes: prev.stayTypes.map((stay) =>
        stay.id === stayId
          ? {
              ...stay,
              options: stay.options.map((opt) => (opt.id === optionId ? { ...opt, price } : opt)),
            }
          : stay
      ),
    }));
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, brochureFile: file, brochureFilename: file.name }));
    }
  };

  // Helper to extract fee based on option id from the form state
  const getFee = (stayId: string, optionId: string) => {
    const stay = form.stayTypes.find((s) => s.id === stayId);
    const opt = stay?.options.find((o) => o.id === optionId);
    return stay?.enabled ? opt?.price : '';
  };

  const buildPayload = (): UpdateDraftPayload => {
    const singleOcc = getFee('residential', 'single_occupancy');
    const twinShare = getFee('residential', 'twin_sharing');
    const nonRes = getFee('non_residential', 'non_residential');
    const resEnabled = form.stayTypes.find((s) => s.id === 'residential')?.enabled;
    const nonResEnabled = form.stayTypes.find((s) => s.id === 'non_residential')?.enabled;

    return {
      title: form.title,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      venue: form.venue || undefined,
      city: form.city || undefined,
      singleOccupancyFee: resEnabled && singleOcc ? Number(singleOcc) : undefined,
      twinSharingFee: resEnabled && twinShare ? Number(twinShare) : undefined,
      nonResidentialFee: nonResEnabled && nonRes ? Number(nonRes) : undefined,
      minParticipants: form.minParticipants ? Number(form.minParticipants) : undefined,
      maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
    };
  };

  const handleSaveDraft = async () => {
    const saved = await saveDraft(programId, buildPayload(), form.brochureFile || undefined);
    if (saved) {
      router.push('/dashboard/programs/drafts');
    }
  };

  const handlePublishConfirm = async () => {
    setPublishError(null);
    const saved = await saveDraft(programId, buildPayload(), form.brochureFile || undefined);
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

  if (isLoadingDraft) {
    return <div className="flex justify-center items-center py-16"><Spinner size="lg" /></div>;
  }

  if (!draft) return null;

  const descriptionText = `${t('draftPrograms.editDraftId', { id: shortDraftId(draft._id) })} · ${t('draftPrograms.editLastUpdated', { date: formatUpdatedAt(draft.updatedAt) })}`;

  return (
    <>
      {/* Publish Modal */}
      <AppModal 
        isOpen={showPublishModal} 
        type="confirm"
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
        onCancel={handlePublishCancel} 
        onConfirm={handlePublishConfirm} 
      />

      {/* Reusable Form Component */}
      <BaseProgramForm
        mode="draft"
        title={t('draftPrograms.editPageTitle')}
        description={descriptionText}
        formState={form}
        onFieldChange={handleFieldChange}
        onToggleStayType={toggleStayType}
        onUpdateOptionPrice={updateOptionPrice}
        onFileChange={handleBrochureChange}
        onSubmitDraft={handleSaveDraft}
        onSubmitPublish={() => setShowPublishModal(true)}
        onBack={() => router.push('/dashboard/programs/drafts')}
        loading={isSaving || isPublishing}
        backLabel={t('draftPrograms.backToDrafts')}
      />
    </>
  );
}