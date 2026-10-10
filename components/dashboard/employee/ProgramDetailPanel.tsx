'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import type { AvailableProgram, StayTypeKey } from '@/types';
import type { StayOption, DetailPanelProps } from '@/types/employee-programs';
import { t } from '@/lib/i18n';
import { AppAlert } from '@/components/shared/app-alert';
import { StayTypeSelector } from './StayTypeSelector';
import { BrochureDownloadLink } from './BrochureDownloadLink';
import { getStayOptionPrice } from '@/utils/formatters';
import AppModal from '@/components/ui/app-modal';
import { useRouter } from 'next/navigation';

function buildStayOptions(program: AvailableProgram): StayOption[] {
  return ([
    { key: 'single_occupancy' as StayTypeKey, label: t('programme.list.stayTypeSingle'), fee: getStayOptionPrice(program.stayOptions, 'single_occupancy') },
    { key: 'twin_sharing' as StayTypeKey, label: t('programme.list.stayTypeTwin'), fee: getStayOptionPrice(program.stayOptions, 'twin_sharing') },
    { key: 'non_residential' as StayTypeKey, label: t('programme.list.stayTypeNonResidential'), fee: getStayOptionPrice(program.stayOptions, 'non_residential') },
  ] as { key: StayTypeKey; label: string; fee: number | undefined }[])
    .filter((o): o is StayOption => o.fee !== undefined && o.fee !== null);
}

export function ProgramDetailPanel({ program, onEnrol, enrolling, enrolled, error }: DetailPanelProps) {
  const router = useRouter();
  const stayOptions = buildStayOptions(program);
  const defaultKey = stayOptions.find((o) => o.key === 'twin_sharing')?.key ?? stayOptions[0]?.key ?? 'twin_sharing';
  const [selectedStay, setSelectedStay] = useState<StayTypeKey>(defaultKey as StayTypeKey);

  // Enrollment modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // Open confirmation modal
  const handleEnrollClick = () => {
    setConfirmOpen(true);
  };

  // User confirms enrollment
  const handleConfirmEnroll = async () => {
    setConfirmOpen(false);

    const success = await onEnrol(selectedStay);

    if (success) {
      setSuccessOpen(true);
    }
  };

  const handleCancelEnroll = () => {
    setConfirmOpen(false);
  };

  return (
    <div className="bg-[#0d1527] px-6 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(160px,1fr)_minmax(320px,420px)_minmax(180px,1fr)] items-start gap-8 lg:gap-10">

        {/* VENUE */}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-2">
            {t('programme.list.detailVenueLabel')}
          </p>

          <p className="text-[13px] font-medium text-white">
            {program.venueName}
          </p>
        </div>

        {/* STAY DETAILS */}
        {stayOptions.length > 0 && (
          <StayTypeSelector
            options={stayOptions}
            value={selectedStay}
            disabled={enrolled}
            onChange={setSelectedStay}
          />
        )}

        {/* ACTIONS */}
        <div className="flex flex-col items-start lg:items-end gap-3 lg:pr-2">
          <div className='flex flex-col items-center gap-2'>
            {program.brochureUrl && (
            <BrochureDownloadLink url={program.brochureUrl} />
          )}

          {enrolled ? (
            <span className="flex items-center gap-1.5 text-[13px] text-green-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              {t('programme.list.enrolledLabel')}
            </span>
          ) : (
            <Button
              onClick={handleEnrollClick}
              disabled={enrolling}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] px-5 h-9 font-medium disabled:opacity-70"
            >
              {enrolling
                ? t('programme.list.enrollingButton')
                : t('programme.list.enrollButton')}

              {!enrolling && (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </Button>
          )}

          {error && (
            <AppAlert
              variant="destructive"
              description={error}
              className="max-w-[220px] text-[11px]"
            />
          )}
          </div>
        </div>
      </div>

      {/* ENROLLMENT CONFIRMATION MODAL */}
      <AppModal
        isOpen={confirmOpen}
        type="confirm"
        title={t('programme.list.enrollConfirmationTitle')}
        description={t('programme.list.enrollConfirmationDescription', {title: program.title})}
        confirmLabel={t('programme.list.enrollButton')}
        cancelLabel={t('common.cancel')}
        loading={enrolling}
        onConfirm={handleConfirmEnroll}
        onCancel={handleCancelEnroll}
      />

      <AppModal
        isOpen={successOpen}
        type="success"
        title={t('programme.list.enrollSuccessTitle')}
        description={t('programme.list.enrollSuccessDescription', {title: program.title})}
        doneLabel={t('button.done')}
        onDone={() => {
          setSuccessOpen(false);
          router.push('/dashboard/enrollments');
        }}
      />
    </div>
  );
}
