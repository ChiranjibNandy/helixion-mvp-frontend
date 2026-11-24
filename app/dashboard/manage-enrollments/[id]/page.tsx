'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft, Info, LockKeyhole, X } from 'lucide-react';
import { providerService } from '@/services/provider.service';
import CancelProgramModal from '@/components/dashboard/provider/CancelProgramModal';
import ProgramSummaryHeader from '@/components/dashboard/provider/ManageEnrollments/ProgramSummaryHeader';
import StatusBanner from '@/components/dashboard/provider/ManageEnrollments/StatusBanner';
import TabBar, { TabKey } from '@/components/dashboard/provider/ManageEnrollments/TabBar';
import EnrollmentsTable from '@/components/dashboard/provider/ManageEnrollments/EnrollmentsTable';
import ProgramDetailsPanel from '@/components/dashboard/provider/ManageEnrollments/ProgramDetailsPanel';
import DocumentsPanel from '@/components/dashboard/provider/ManageEnrollments/DocumentsPanel';
import { exportEnrollmentsToCsv } from '@/components/dashboard/provider/ManageEnrollments/exportCsv';
import { useManagedEnrollments } from '@/components/dashboard/provider/ManageEnrollments/useManagedEnrollments';
import { countActiveEnrollments, formatDate } from '@/components/dashboard/provider/ManageEnrollments/utils';
import { updateProgramFreezeStatusApi } from '@/services/programService';
import AppModal from '@/components/ui/app-modal';

export default function ManageEnrollmentsPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params?.id as string;

  const { program, enrollments, loading, reload } = useManagedEnrollments(programId);
  const [cancelProgramOpen, setCancelProgramOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('enrolments');

  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [freezing, setFreezing] = useState(false);
  const [freezeError, setFreezeError] = useState<string | null>(null);

  const activeCount = countActiveEnrollments(enrollments);
  const belowMinimum = program?.minParticipants != null && activeCount < program.minParticipants;
  const overEnrolled = program?.maxParticipants != null && activeCount > program.maxParticipants;
  const isCancelled = program?.status === 'cancelled';
  const ringStatus = isCancelled || overEnrolled ? 'danger' : belowMinimum ? 'warning' : 'ok';

  const handleConfirm = async (enrollmentId: string) => {
    try {
      await providerService.confirmEnrollment(programId, enrollmentId);
      toast.success('Enrolment confirmed.');
      await reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Could not confirm this enrolment.');
    }
  };

  const handleCancelEnrollment = async (enrollmentId: string) => {
    try {
      await providerService.cancelEnrollment(programId, enrollmentId);
      toast.success('Enrolment cancelled.');
      await reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Could not cancel this enrolment.');
    }
  };

  //freeze program 

  const handleFreezeEnrollments = async () => {
    try {
      setFreezing(true);
      setFreezeError(null);

      await updateProgramFreezeStatusApi(programId, true);

      toast.success('Enrolments closed and frozen successfully.');

      setFreezeModalOpen(false);

      await reload();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        'Could not freeze program enrollments.';

      setFreezeError(
        Array.isArray(message) ? message.join(', ') : message
      );

      toast.error(
        Array.isArray(message) ? message.join(', ') : message
      );
    } finally {
      setFreezing(false);
    }
  };

  //program days
  const programDays =
    program?.startDate && program?.endDate
      ? Math.ceil(
        (new Date(program.endDate).getTime() -
          new Date(program.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1
      : null;

  //location
  const programLocation =
    [program?.city, program?.state].filter(Boolean).join(', ') ||
    program?.venueName ||
    'N/A';

    //pending count
  const pendingCount = enrollments.filter(
    (item: any) => item.status?.toLowerCase() === 'pending'
  ).length;

  //confirmed count
  const confirmedCount = enrollments.filter(
    (item: any) => item.status?.toLowerCase() === 'confirmed'
  ).length;

  //cancelled count
  const cancelledCount = enrollments.filter(
    (item: any) => item.status?.toLowerCase() === 'cancelled'
  ).length;

  if (loading) {
    return <div className="p-6 text-sm text-textSidebarMuted">Loading…</div>;
  }

  if (!program) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-primary hover:underline w-fit">
          <ChevronLeft size={14} /> Back to programs
        </button>
        <p className="text-sm text-textSidebarMuted">Program not found.</p>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'enrolments', label: `Enrolments (${ enrollments.length })` },
    { key: 'details', label: 'Program Details' },
    { key: 'documents', label: 'Documents' },
  ];

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <button onClick={() => router.push('/dashboard/programs/list')} className="inline-flex items-center gap-1 text-sm text-blue-300 hover:underline w-fit">
          <ChevronLeft size={14} /> Back to Programs
        </button>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
        <ProgramSummaryHeader program={program} activeCount={activeCount} ringStatus={ringStatus} />

        <StatusBanner
          isCancelled={isCancelled}
          belowMinimum={belowMinimum}
          overEnrolled={overEnrolled}
          activeCount={activeCount}
          minParticipants={program.minParticipants}
          maxParticipants={program.maxParticipants}
        />

        <TabBar
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
          onExport={() => exportEnrollmentsToCsv(program.title, enrollments)}
          onCancelProgram={() => setCancelProgramOpen(true)}
          onCloseFreezeEnrollments={() => setFreezeModalOpen(true)}
          showCancelProgram={!isCancelled}
        />


        <AppModal
          isOpen={freezeModalOpen}
          onClose={() => {
            if (!freezing) {
              setFreezeModalOpen(false);
              setFreezeError(null);
            }
          }}
          className="max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-2xl"
        >
          <div className="flex flex-col gap-4 text-gray-900">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <LockKeyhole size={22} />
                </div>

                <h2 className="text-base font-bold">
                  Close & Freeze Enrolments
                </h2>
              </div>

              <button
                type="button"
                disabled={freezing}
                onClick={() => setFreezeModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-600">
              Are you sure you want to close and freeze enrolments
              for this program?
            </p>

            {/* Program Information */}
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex flex-col gap-2 text-xs">

                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-gray-500">Program</span>
                  <span className="font-semibold text-gray-900">
                    {program.title}
                  </span>
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-gray-500">Program Dates</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(program.startDate)} – {formatDate(program.endDate)}
                    {programDays !== null && ` (${ programDays } days)`}
                  </span>
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-800">
                    {programLocation}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-gray-500">
                      Current Enrolments
                    </span>

                    <span className="rounded bg-gray-200 px-2 py-1 font-semibold text-gray-800">
                      {enrollments.length}
                    </span>

                    <span className="rounded bg-orange-100 px-2 py-1 font-semibold text-orange-700">
                      {pendingCount} Pending
                    </span>

                    <span className="rounded bg-green-100 px-2 py-1 font-semibold text-green-700">
                      {confirmedCount} Confirmed
                    </span>

                    <span className="rounded bg-red-100 px-2 py-1 font-semibold text-red-700">
                      {cancelledCount} Cancelled
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Warning */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <div className="flex gap-2">
                <Info size={19} className="mt-0.5 shrink-0 text-blue-600" />

                <div className="flex flex-col gap-2 text-xs text-blue-900">
                  <p>• No further enrolments will be allowed.</p>
                  <p>
                    • Existing enrolments (confirmed, pending or cancelled)
                    cannot be changed.
                  </p>
                  <p>• This action cannot be undone.</p>
                </div>
              </div>
            </div>

            {/* Error */}
            {freezeError && (
              <p className="text-sm text-red-600">
                {freezeError}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={freezing}
                onClick={() => setFreezeModalOpen(false)}
                className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={freezing}
                onClick={handleFreezeEnrollments}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {freezing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <LockKeyhole size={15} />
                    Close & Freeze Enrolments
                  </>
                )}
              </button>
            </div>

          </div>
        </AppModal>


        {tab === 'enrolments' && (
          <EnrollmentsTable
            enrollments={enrollments}
            isCancelled={isCancelled}
            onConfirm={handleConfirm}
            onCancel={handleCancelEnrollment}
          />
        )}
        {tab === 'details' && <ProgramDetailsPanel program={program} isCancelled={isCancelled} />}
        {tab === 'documents' && <DocumentsPanel program={program} />}
      </div>

      <CancelProgramModal
        isOpen={cancelProgramOpen}
        onClose={() => setCancelProgramOpen(false)}
        programId={programId}
        programTitle={program.title}
        activeEnrollmentCount={activeCount}
        minParticipants={program.minParticipants}
        maxParticipants={program.maxParticipants}
        onCancelled={reload}
        onViewDetails={() => setTab('details')}
      />
    </div>
  );
}
