
'use client';

import { Info, LockKeyhole, X } from 'lucide-react';

import { ManagedEnrollment } from '@/services/provider.service';
import { ENROLLMENT_STATUS } from '@/constants/program';
import { displayStatus, formatDate } from './utils';
import { t } from '@/lib/i18n';

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

   if (!isOpen) return null;

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
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
         onClick={(e) => {
            if (e.target === e.currentTarget) {
               handleClose();
            }
         }}
      >
         <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="freeze-modal-title"
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95"
         >

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                     <LockKeyhole size={22} />
                  </div>

                  <h2
                     id="freeze-modal-title"
                     className="text-base font-bold text-gray-900"
                  >
                     {t('programme.enrollments.closeFreezeEnrollment')}
                  </h2>
               </div>

               <button
                  type="button"
                  disabled={loading}
                  onClick={handleClose}
                  className="text-gray-400 transition hover:text-gray-700 disabled:opacity-50"
                  aria-label="Close modal"
               >
                  <X size={20} />
               </button>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
               {t('programme.enrollments.freezeDescription')}
            </p>

            {/* Program Information */}
            <div className="mb-4 rounded-lg bg-gray-50 p-3">
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
                           ` (${ programDays } ${ t('upcomingPrograms.days.days') })`}
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
            <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
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
               <p className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-600">
                  {error}
               </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">

               <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled={loading}
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
               >
                  {t('enrollment.status.cancelled')}
               </Button>

               <Button
                  type="button"
                  variant="default"
                  size="lg"
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
                        <LockKeyhole size={15} />
                        {t('programme.enrollments.closeFreezeEnrollment')}
                     </>
                  )}
               </Button>

            </div>
         </div>
      </div>
   );
}
