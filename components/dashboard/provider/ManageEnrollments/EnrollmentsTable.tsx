'use client';

import { useEffect, useMemo, useState } from 'react';
import PaginationController from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ManagedEnrollment } from '@/services/provider.service';
import { displayStatus, statusBadgeClass, formatDate } from './utils';

const PAGE_SIZE = 5;

interface EnrollmentsTableProps {
  enrollments: ManagedEnrollment[];
  isCancelled: boolean;
  onConfirm: (enrollmentId: string) => Promise<void>;
  onCancel: (enrollmentId: string) => Promise<void>;
}

export default function EnrollmentsTable({ enrollments, isCancelled, onConfirm, onCancel }: EnrollmentsTableProps) {
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(enrollments.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedEnrollments = useMemo(
    () => enrollments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [enrollments, page]
  );

  const runAction = async (enrollmentId: string, action: (id: string) => Promise<void>) => {
    setBusyId(enrollmentId);
    try {
      await action(enrollmentId);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="text-left text-xs uppercase tracking-widest text-gray-400 border-b border-gray-200 hover:bg-transparent">
            <TableHead className="h-auto pb-2 pr-2 pl-0 text-gray-400">#</TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">Employee Name</TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">Company Name</TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">Nomination Date</TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">Status</TableHead>
            <TableHead className="h-auto pb-2 pr-0 text-right text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedEnrollments.map((enrollment, index) => {
            const status = displayStatus(enrollment.currentStage);
            const isBusy = busyId === enrollment._id;
            return (
              <TableRow key={enrollment._id} className="border-b border-gray-100 hover:bg-transparent">
                <TableCell className="py-2.5 pr-2 pl-0 text-gray-400">{(page - 1) * PAGE_SIZE + index + 1}</TableCell>
                <TableCell className="py-2.5 pr-2 text-gray-900 font-medium">{enrollment.employeeId?.name ?? '-'}</TableCell>
                <TableCell className="py-2.5 pr-2 text-gray-500">{enrollment.orgId?.name ?? '-'}</TableCell>
                <TableCell className="py-2.5 pr-2 text-gray-500">{formatDate(enrollment.createdAt)}</TableCell>
                <TableCell className="py-2.5 pr-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusBadgeClass(status)}`}>
                    {status}
                  </span>
                </TableCell>
                <TableCell className="py-2.5 pr-0 text-right">
                  {status === 'Pending' && !isCancelled ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={isBusy}
                        onClick={() => runAction(enrollment._id, onConfirm)}
                        className="h-7 px-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => runAction(enrollment._id, onCancel)}
                        className="h-7 px-2.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {enrollments.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-6 text-center text-gray-400">No enrolments yet for this program.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {enrollments.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1} – {Math.min(page * PAGE_SIZE, enrollments.length)} of {enrollments.length} enrolments
          </span>
          {totalPages > 1 && (
            <PaginationController page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}
    </>
  );
}
