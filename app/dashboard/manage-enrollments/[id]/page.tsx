'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { providerService, EnrollmentCancellationReason } from '@/services/provider.service';
import CancelProgramModal from '@/components/dashboard/provider/CancelProgramModal';
import ProgramSummaryHeader from '@/components/dashboard/provider/ManageEnrollments/ProgramSummaryHeader';
import StatusBanner from '@/components/dashboard/provider/ManageEnrollments/StatusBanner';
import TabBar, { TabKey } from '@/components/dashboard/provider/ManageEnrollments/TabBar';
import EnrollmentsTable from '@/components/dashboard/provider/ManageEnrollments/EnrollmentsTable';
import ProgramDetailsPanel from '@/components/dashboard/provider/ManageEnrollments/ProgramDetailsPanel';
import DocumentsPanel from '@/components/dashboard/provider/ManageEnrollments/DocumentsPanel';
import FreezeEnrollmentsModal from '@/components/dashboard/provider/ManageEnrollments/FreezeEnrollmentsModal';
import { exportEnrollmentsToCsv } from '@/components/dashboard/provider/ManageEnrollments/exportCsv';
import { useManagedEnrollments } from '@/components/dashboard/provider/ManageEnrollments/useManagedEnrollments';
import { countActiveEnrollments, countByDisplayStatus } from '@/components/dashboard/provider/ManageEnrollments/utils';

export default function ManageEnrollmentsPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params?.id as string;

  const { program, enrollments, loading, reload } = useManagedEnrollments(programId);
  const [cancelProgramOpen, setCancelProgramOpen] = useState(false);
  const [freezeOpen, setFreezeOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('enrolments');

  const activeCount = countActiveEnrollments(enrollments);
  const { pending: pendingCount, confirmed: confirmedCount, cancelled: cancelledCount } = countByDisplayStatus(enrollments);
  const belowMinimum = program?.minParticipants != null && activeCount < program.minParticipants;
  const overEnrolled = program?.maxParticipants != null && activeCount > program.maxParticipants;
  const isCancelled = program?.status === 'cancelled';
  const isFrozen = !!program?.enrolmentsFrozen;

  const handleConfirmOne = async (enrollmentId: string) => {
    await providerService.confirmEnrollment(programId, enrollmentId);
    toast.success('Enrolment confirmed.');
    await reload();
  };

  const handleCancelOne = async (enrollmentId: string, reason: EnrollmentCancellationReason, notes?: string) => {
    await providerService.cancelEnrollment(programId, enrollmentId, reason, notes);
    toast.success('Enrolment cancelled.');
    await reload();
  };

  const handleConfirmBulk = async (enrollmentIds: string[]) => {
    const result = await providerService.confirmEnrollmentsBulk(programId, enrollmentIds);
    toast.success(`Confirmed ${result.confirmedCount} of ${result.requestedCount} selected enrolments.`);
    await reload();
  };

  const handleCancelBulk = async (enrollmentIds: string[], reason: EnrollmentCancellationReason, notes?: string) => {
    const result = await providerService.cancelEnrollmentsBulk(programId, enrollmentIds, reason, notes);
    toast.success(`Cancelled ${result.cancelledCount} of ${result.requestedCount} selected enrolments.`);
    await reload();
  };

  const handleFreezeEnrollments = async () => {
    await providerService.freezeProgramEnrollments(programId);
    toast.success('Enrolments closed and frozen.');
    await reload();
  };

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
    { key: 'enrolments', label: `Enrolments (${enrollments.length})` },
    { key: 'details', label: 'Program Details' },
    { key: 'documents', label: 'Documents' },
  ];

  return (
    <div className="flex flex-col gap-5 p-6">
      <nav className="flex items-center gap-1.5 text-sm text-blue-300">
        <Link href="/dashboard/programs/list" className="hover:underline">Programs</Link>
        <ChevronRight size={14} className="text-gray-500" />
        <Link href={`/dashboard/programs/${programId}`} className="hover:underline">{program.title}</Link>
        <ChevronRight size={14} className="text-gray-500" />
        <span className="text-gray-400">Enrolment Management</span>
      </nav>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
        <ProgramSummaryHeader
          program={program}
          enrolledCount={activeCount}
          pendingCount={pendingCount}
          confirmedCount={confirmedCount}
          cancelledCount={cancelledCount}
          isCancelled={isCancelled}
          isFrozen={isFrozen}
          onCancelProgram={() => setCancelProgramOpen(true)}
          onFreezeEnrollments={() => setFreezeOpen(true)}
        />

        <StatusBanner
          isCancelled={isCancelled}
          belowMinimum={belowMinimum}
          overEnrolled={overEnrolled}
          activeCount={activeCount}
          minParticipants={program.minParticipants}
          maxParticipants={program.maxParticipants}
        />

        {isFrozen && !isCancelled && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
            Enrolments for this program are closed and frozen — no further changes are allowed.
          </div>
        )}

        <TabBar
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
          onExport={() => exportEnrollmentsToCsv(program.title, enrollments)}
        />

        {tab === 'enrolments' && (
          <EnrollmentsTable
            enrollments={enrollments}
            actionsDisabled={isCancelled || isFrozen}
            onConfirmOne={handleConfirmOne}
            onCancelOne={handleCancelOne}
            onConfirmBulk={handleConfirmBulk}
            onCancelBulk={handleCancelBulk}
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

      <FreezeEnrollmentsModal
        isOpen={freezeOpen}
        onClose={() => setFreezeOpen(false)}
        onConfirm={handleFreezeEnrollments}
      />
    </div>
  );
}
