'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, ArrowUp, ArrowDown, ChevronsUpDown, CheckCircle2, Ban } from 'lucide-react';
import PaginationController from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ManagedEnrollment, EnrollmentCancellationReason } from '@/services/provider.service';
import { displayStatus, statusBadgeClass, formatDate, isConfirmable, isCancellable, DisplayStatus } from './utils';
import ConfirmEnrollmentModal from './ConfirmEnrollmentModal';
import CancelEnrollmentModal from './CancelEnrollmentModal';
import { EnrollmentActionEmployee } from './EnrollmentActionEmployee';

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const STATUS_FILTERS: DisplayStatus[] = ['Pending', 'Confirmed', 'Cancelled'];

type SortKey = 'name' | 'company' | 'designation' | 'date' | 'status';

const SORT_VALUE: Record<SortKey, (e: ManagedEnrollment) => string> = {
  name: (e) => e.employeeId?.name ?? '',
  company: (e) => e.orgId?.name ?? '',
  designation: (e) => e.employeeId?.designation ?? '',
  date: (e) => e.createdAt,
  status: (e) => displayStatus(e.currentStage),
};

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey | null;
  direction: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const isActive = activeKey === sortKey;
  const Icon = isActive ? (direction === 'asc' ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 ${className ?? ''}`}
    >
      {label} <Icon size={12} className={isActive ? 'text-gray-600' : 'text-gray-300'} />
    </button>
  );
}

interface EnrollmentsTableProps {
  enrollments: ManagedEnrollment[];
  /** Program is cancelled or enrolments are frozen — no actions allowed at all */
  actionsDisabled: boolean;
  onConfirmOne: (enrollmentId: string) => Promise<void>;
  onCancelOne: (enrollmentId: string, reason: EnrollmentCancellationReason, notes?: string) => Promise<void>;
  onConfirmBulk: (enrollmentIds: string[]) => Promise<void>;
  onCancelBulk: (enrollmentIds: string[], reason: EnrollmentCancellationReason, notes?: string) => Promise<void>;
}

const toActionEmployee = (e: ManagedEnrollment): EnrollmentActionEmployee => ({
  enrollmentId: e._id,
  name: e.employeeId?.name ?? 'Unknown',
  company: e.orgId?.name,
  designation: e.employeeId?.designation,
  nominationDate: e.createdAt,
});


export default function EnrollmentsTable({
  enrollments,
  actionsDisabled,
  onConfirmOne,
  onCancelOne,
  onConfirmBulk,
  onCancelBulk,
}: EnrollmentsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DisplayStatus | 'all'>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [singleConfirmTarget, setSingleConfirmTarget] = useState<ManagedEnrollment | null>(null);
  const [singleCancelTarget, setSingleCancelTarget] = useState<ManagedEnrollment | null>(null);
  const [bulkModal, setBulkModal] = useState<'confirm' | 'cancel' | null>(null);

  const companies = useMemo(() => {
    const names = new Set<string>();
    enrollments.forEach((e) => e.orgId?.name && names.add(e.orgId.name));
    return Array.from(names).sort();
  }, [enrollments]);

  const filteredEnrollments = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = enrollments.filter((e) => {
      if (statusFilter !== 'all' && displayStatus(e.currentStage) !== statusFilter) return false;
      if (companyFilter !== 'all' && e.orgId?.name !== companyFilter) return false;
      if (!q) return true;
      return (
        e.employeeId?.name?.toLowerCase().includes(q) ||
        e.orgId?.name?.toLowerCase().includes(q) ||
        e.employeeId?.designation?.toLowerCase().includes(q)
      );
    });

    if (!sortKey) return filtered;
    const getValue = SORT_VALUE[sortKey];
    const sorted = [...filtered].sort((a, b) => getValue(a).localeCompare(getValue(b)));
    return sortDir === 'asc' ? sorted : sorted.reverse();
  }, [enrollments, search, statusFilter, companyFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredEnrollments.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [search, statusFilter, companyFilter, pageSize]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const pagedEnrollments = useMemo(
    () => filteredEnrollments.slice((page - 1) * pageSize, page * pageSize),
    [filteredEnrollments, page, pageSize]
  );

  const selectableOnPage = pagedEnrollments.filter((e) => !actionsDisabled && isCancellable(e.currentStage));
  const allOnPageSelected = selectableOnPage.length > 0 && selectableOnPage.every((e) => selectedIds.has(e._id));

  const toggleSelectAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        selectableOnPage.forEach((e) => next.delete(e._id));
      } else {
        selectableOnPage.forEach((e) => next.add(e._id));
      }
      return next;
    });
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedEnrollments = enrollments.filter((e) => selectedIds.has(e._id));

  const handleReset = () => {
    setSearch('');
    setStatusFilter('all');
    setCompanyFilter('all');
  };

  const closeBulkModal = () => setBulkModal(null);
  const clearSelection = () => setSelectedIds(new Set());

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name, company, designation..."
            className="w-full h-9 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DisplayStatus | 'all')}
          className="h-9 px-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all" className="text-gray-900">All Statuses</option>
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s} className="text-gray-900">{s}</option>
          ))}
        </select>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="h-9 px-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all" className="text-gray-900">All Companies</option>
          {companies.map((c) => (
            <option key={c} value={c} className="text-gray-900">{c}</option>
          ))}
        </select>
        <button
          onClick={handleReset}
          className="h-9 px-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
          <span className="text-sm text-gray-700">{selectedIds.size} employees selected</span>
          <button
            onClick={() => setBulkModal('confirm')}
            className="h-8 px-3 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-500"
          >
            Confirm Selected ({selectedIds.size})
          </button>
          <button
            onClick={() => setBulkModal('cancel')}
            className="h-8 px-3 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-500"
          >
            Cancel Selected ({selectedIds.size})
          </button>
        </div>
      )}

      <Table className="text-sm">
        <TableHeader>
          <TableRow className="text-left text-xs uppercase tracking-widest text-gray-400 border-b border-gray-200 hover:bg-transparent">
            <TableHead className="h-auto w-8 pb-2 pl-0 pr-2">
              <input
                type="checkbox"
                checked={allOnPageSelected}
                onChange={toggleSelectAllOnPage}
                disabled={selectableOnPage.length === 0}
                aria-label="Select all on this page"
              />
            </TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">#</TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">
              <SortableHeader label="Employee Name" sortKey="name" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
            </TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">
              <SortableHeader label="Company Name" sortKey="company" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
            </TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">
              <SortableHeader label="Designation" sortKey="designation" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
            </TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">
              <SortableHeader label="Nomination Date" sortKey="date" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
            </TableHead>
            <TableHead className="h-auto pb-2 pr-2 text-gray-400">
              <SortableHeader label="Status" sortKey="status" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
            </TableHead>
            <TableHead className="h-auto pb-2 pr-0 text-right text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedEnrollments.map((enrollment, index) => {
            const status = displayStatus(enrollment.currentStage);
            const selectable = !actionsDisabled && isCancellable(enrollment.currentStage);
            return (
              <TableRow key={enrollment._id} className="border-b border-gray-100 hover:bg-transparent">
                <TableCell className="py-2.5 pl-0 pr-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(enrollment._id)}
                    onChange={() => toggleSelectOne(enrollment._id)}
                    disabled={!selectable}
                    aria-label={`Select ${enrollment.employeeId?.name ?? 'row'}`}
                  />
                </TableCell>
                <TableCell className="py-2.5 pr-2 text-gray-400">{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell className="py-2.5 pr-2 text-gray-900 font-medium">{enrollment.employeeId?.name ?? '-'}</TableCell>
                <TableCell className="py-2.5 pr-2 text-gray-500">{enrollment.orgId?.name ?? '-'}</TableCell>
                <TableCell className="py-2.5 pr-2 text-gray-500">{enrollment.employeeId?.designation ?? '-'}</TableCell>
                <TableCell className="py-2.5 pr-2 text-gray-500">{formatDate(enrollment.createdAt)}</TableCell>
                <TableCell className="py-2.5 pr-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusBadgeClass(status)}`}>
                    {status}
                  </span>
                </TableCell>
                <TableCell className="py-2.5 pr-0 text-right">
                  {!actionsDisabled && status !== 'Cancelled' ? (
                    <div className="flex items-center justify-end gap-2">
                      {isConfirmable(enrollment.currentStage) && (
                        <button
                          onClick={() => setSingleConfirmTarget(enrollment)}
                          className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50"
                        >
                          <CheckCircle2 size={12} /> Confirm
                        </button>
                      )}
                      <button
                        onClick={() => setSingleCancelTarget(enrollment)}
                        className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
                      >
                        <Ban size={12} /> Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {filteredEnrollments.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8} className="py-6 text-center text-gray-400">
                {enrollments.length === 0 ? 'No enrolments yet for this program.' : 'No enrolments match the current filters.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {filteredEnrollments.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {(page - 1) * pageSize + 1} – {Math.min(page * pageSize, filteredEnrollments.length)} of {filteredEnrollments.length} enrolments
          </span>
          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <PaginationController page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-7 px-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size} className="text-gray-900">{size} / page</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <ConfirmEnrollmentModal
        isOpen={!!singleConfirmTarget}
        onClose={() => setSingleConfirmTarget(null)}
        employees={singleConfirmTarget ? [toActionEmployee(singleConfirmTarget)] : []}
        onConfirm={async () => {
          if (!singleConfirmTarget) return;
          await onConfirmOne(singleConfirmTarget._id);
        }}
      />

      <CancelEnrollmentModal
        isOpen={!!singleCancelTarget}
        onClose={() => setSingleCancelTarget(null)}
        employees={singleCancelTarget ? [toActionEmployee(singleCancelTarget)] : []}
        currentStatus={singleCancelTarget ? displayStatus(singleCancelTarget.currentStage) : undefined}
        onCancel={async (reason, notes) => {
          if (!singleCancelTarget) return;
          await onCancelOne(singleCancelTarget._id, reason, notes);
        }}
      />

      <ConfirmEnrollmentModal
        isOpen={bulkModal === 'confirm'}
        onClose={closeBulkModal}
        employees={selectedEnrollments.map(toActionEmployee)}
        onConfirm={async () => {
          await onConfirmBulk(Array.from(selectedIds));
          clearSelection();
        }}
      />

      <CancelEnrollmentModal
        isOpen={bulkModal === 'cancel'}
        onClose={closeBulkModal}
        employees={selectedEnrollments.map(toActionEmployee)}
        onCancel={async (reason, notes) => {
          await onCancelBulk(Array.from(selectedIds), reason, notes);
          clearSelection();
        }}
      />
    </>
  );
}
