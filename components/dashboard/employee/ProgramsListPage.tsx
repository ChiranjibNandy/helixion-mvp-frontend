'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getAvailablePrograms, enrollInProgram } from '@/services/employeeService';
import SearchInput from '@/components/ui/search-input';
import type { AvailableProgram, StayTypeKey } from '@/types';
import type { Filters } from '@/types/employee-programs';
import { formatShortDate } from '@/utils/formatters';
import { PAGE_SIZE, EMPTY_FILTERS } from '@/constants/employee';
import { t } from '@/lib/i18n';
import DataTable from '@/components/shared/data-table';
import PaginationController from '@/components/ui/pagination';
import { AppAlert } from '@/components/shared/app-alert';
import { ProgramFilterBar } from './ProgramFilterBar';
import { ProgramDetailPanel } from './ProgramDetailPanel';

const HEADER_CLASS = 'text-[10px] font-semibold tracking-widest uppercase text-white/30';

function getProviderName(program: AvailableProgram): string {
  if (program.providerName) return program.providerName;
  if (typeof program.training_providerId === 'object' && program.training_providerId?.username) {
    return program.training_providerId.username;
  }
  return '—';
}

const COLUMNS = [
  {
    header: t('programme.list.columnTitle'),
    headerClassName: HEADER_CLASS,
    className: 'font-semibold text-white text-[13px] max-w-[220px]',
    render: (prog: AvailableProgram) => prog.title,
  },
  {
    header: t('programme.list.columnFromDate'),
    headerClassName: HEADER_CLASS,
    className: 'text-white/60 text-[13px]',
    render: (prog: AvailableProgram) => formatShortDate(prog.startDate),
  },
  {
    header: t('programme.list.columnToDate'),
    headerClassName: HEADER_CLASS,
    className: 'text-white/60 text-[13px]',
    render: (prog: AvailableProgram) => formatShortDate(prog.endDate),
  },
  {
    header: t('programme.list.columnVenue'),
    headerClassName: HEADER_CLASS,
    className: 'text-white/60 text-[13px]',
    render: (prog: AvailableProgram) => prog.venue,
  },
  {
    header: t('programme.list.columnProvider'),
    headerClassName: HEADER_CLASS,
    className: 'text-white/60 text-[13px] max-w-[180px]',
    render: (prog: AvailableProgram) => getProviderName(prog),
  },
];


export function ProgramsListPage() {
  const [programs,     setPrograms]     = useState<AvailableProgram[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState<string | null>(null);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [draft,        setDraft]        = useState<Filters>(EMPTY_FILTERS);
  const [applied,      setApplied]      = useState<Filters>(EMPTY_FILTERS);
  const [enrollingId,  setEnrollingId]  = useState<string | null>(null);
  const [enrolledIds,  setEnrolledIds]  = useState<Set<string>>(new Set());
  const [enrollErrors, setEnrollErrors] = useState<Record<string, string>>({});

  const seqRef = useRef(0);

  const load = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAvailablePrograms({
        page,
        limit:    PAGE_SIZE,
        search:   applied.title    || undefined,
        venue:    applied.venue    || undefined,
        fromDate: applied.fromDate || undefined,
        toDate:   applied.toDate   || undefined,
      });
      if (seq !== seqRef.current) return;
      setPrograms(data.programs);
      setTotal(data.total);
    } catch {
      if (seq !== seqRef.current) return;
      setFetchError(t('programme.list.fetchError'));
      setPrograms([]);
      setTotal(0);
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => { load(); }, [load]);

  function handleApply() {
    setPage(1);
    setApplied({ ...draft });
  }

  function handleClear() {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  }

  async function handleEnrol(programId: string, stayType: StayTypeKey) {
    setEnrollingId(programId);
    setEnrollErrors((prev) => { const next = { ...prev }; delete next[programId]; return next; });
    try {
      await enrollInProgram(programId, stayType);
      setEnrolledIds((prev) => new Set(prev).add(programId));
      setSelectedId(null);
    } catch (err: unknown) {
      const raw = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
      const msg = Array.isArray(raw)
        ? raw.join(', ')
        : (typeof raw === 'string' ? raw : t('programme.list.enrollError'));
      setEnrollErrors((prev) => ({ ...prev, [programId]: msg }));
    } finally {
      setEnrollingId(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div className="flex flex-col h-full space-y-4">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white">{t('programme.list.title')}</h1>
          <p className="text-[12px] text-white/40 mt-0.5">{t('programme.list.description')}</p>
        </div>
        <SearchInput
          value={draft.title}
          onChange={(v) => setDraft((p) => ({ ...p, title: v }))}
          placeholder={t('programme.list.searchPlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="w-56 flex-shrink-0 mt-1"
        />
      </div>

      <ProgramFilterBar
        draft={draft}
        onChange={setDraft}
        onApply={handleApply}
        onClear={handleClear}
        loading={loading}
      />

      {fetchError && (
        <AppAlert variant="destructive" description={fetchError} />
      )}

      <DataTable
        data={programs}
        columns={COLUMNS}
        loading={loading}
        className="border-[#1e2d40]"
        rowKey={(prog) => prog._id}
        onRowClick={(prog) => setSelectedId((prev) => (prev === prog._id ? null : prog._id))}
        rowClassName={(prog) =>
          `border-[#1e2d40] cursor-pointer transition-colors ${
            selectedId === prog._id
              ? 'bg-[#0d1e33] border-l-2 border-l-blue-500'
              : 'hover:bg-[#111827]'
          }`
        }
        isRowExpanded={(prog) => selectedId === prog._id}
        renderExpandedRow={(prog) => (
          <ProgramDetailPanel
            program={prog}
            onEnrol={(stayType) => handleEnrol(prog._id, stayType)}
            enrolling={enrollingId === prog._id}
            enrolled={enrolledIds.has(prog._id)}
            error={enrollErrors[prog._id] ?? null}
          />
        )}
      />

      {totalPages > 1 && (
        <PaginationController
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

    </div>
  );
}
