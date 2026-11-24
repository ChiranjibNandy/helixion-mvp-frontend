
'use client';

import { Info, LockKeyhole } from 'lucide-react';

import { ManagedEnrollment } from '@/services/provider.service';
import { ENROLLMENT_STATUS } from '@/constants/program';
import { displayStatus, formatDate } from './utils';
import { t } from '@/lib/i18n';

import AppModal from '@/components/ui/app-modal';
import { Button } from '@/components/ui/button';

interface FreezeProgram {
  title: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  state?: string;
  venueName?: string;
}

interface FreezeEnrollmentsModalProps {
  isOpen: boolean;
  program: FreezeProgram;
  enrollments: ManagedEnrollment[];
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function FreezeEnrollmentsModal({
  isOpen,
  program,
  enrollments,
  loading = false,
  error,
  onClose,
  onConfirm,
}: FreezeEnrollmentsModalProps) {
  const pendingCount = enrollments.filter(
    (item) =>
      displayStatus(item.currentStage) === ENROLLMENT_STATUS.PENDING
  ).length;

  const confirmedCount = enrollments.filter(
    (item) =>
      displayStatus(item.currentStage) === ENROLLMENT_STATUS.CONFIRMED
  ).length;

  const cancelledCount = enrollments.filter(
    (item) =>
      displayStatus(item.currentStage) === ENROLLMENT_STATUS.CANCELLED
  ).length;

  const programDays =
    program.startDate && program.endDate
      ? Math.ceil(
          (new Date(program.endDate).getTime() -
            new Date(program.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : null;

  const programLocation =
    [program.city, program.state].filter(Boolean).join(', ') ||
    program.venueName ||
    'N/A';

  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <AppModal
      isOpen={isOpen}
      title={t('programme.enrollments.closeFreezeEnrollment')}
      onClose={handleClose}
      className="max-w-md rounded-xl bg-white p-5"
    >
      <div className="flex flex-col gap-4 text-gray-900">

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-600">
          {t('programme.enrollments.freezeDescription')}
        </p>

        {/* Program Information */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex flex-col gap-2 text-xs">

            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-gray-500">
                {t('upcomingPrograms.columns.program')}
              </span>

              <span className="font-semibold text-gray-900">
                {program.title}
              </span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-gray-500">
                {t('draftPrograms.labelProgramDates')}
              </span>

              <span className="font-medium text-gray-800">
                {formatDate(program.startDate)} – {formatDate(program.endDate)}
                {programDays !== null &&
                  ` (${programDays} ${t('upcomingPrograms.days.days')})`}
              </span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-gray-500">
                {t('settings.location.value')}
              </span>

              <span className="font-medium text-gray-800">
                {programLocation}
              </span>
            </div>

            {/* Enrollment Statistics */}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">

                <span className="mr-1 text-gray-500">
                  {t('programme.enrollments.currentEnrolments')}
                </span>

                <span className="rounded bg-gray-200 px-2 py-1 font-semibold text-gray-800">
                  {enrollments.length}
                </span>

                <span className="rounded bg-orange-100 px-2 py-1 font-semibold text-orange-700">
                  {pendingCount} {t('enrollment.status.pend')}
                </span>

                <span className="rounded bg-green-100 px-2 py-1 font-semibold text-green-700">
                  {confirmedCount} {t('programme.list.confirmedLabel')}
                </span>

                <span className="rounded bg-red-100 px-2 py-1 font-semibold text-red-700">
                  {cancelledCount} {t('enrollment.status.cancelled')}
                </span>

              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
          <div className="flex gap-2">

            <Info
              size={19}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div className="flex flex-col gap-2 text-xs text-blue-900">
              <p>
                • {t('programme.enrollments.warnings.noFurtherEnrollments')}
              </p>

              <p>
                • {t('programme.enrollments.warnings.existingEnrollments')}
              </p>

              <p>
                • {t('programme.enrollments.warnings.cannotBeUndone')}
              </p>
            </div>
          </div>
        </div>

        {/* API Error */}
        {error && (
          <p className="rounded-md bg-red-50 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleClose}
          >
            {t('enrollment.status.cancelled')}
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {t('common.processing')}
              </>
            ) : (
              <>
                <LockKeyhole size={15} className="mr-2" />
                {t('programme.enrollments.closeFreezeEnrollment')}
              </>
            )}
          </Button>

        </div>
      </div>
    </AppModal>
  );
}
