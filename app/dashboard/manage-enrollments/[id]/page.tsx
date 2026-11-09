'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
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
import { countActiveEnrollments } from '@/components/dashboard/provider/ManageEnrollments/utils';

export default function ManageEnrollmentsPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params?.id as string;

  const { program, enrollments, loading, reload } = useManagedEnrollments(programId);
  const [cancelProgramOpen, setCancelProgramOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('enrolments');

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
          showCancelProgram={!isCancelled}
        />

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
