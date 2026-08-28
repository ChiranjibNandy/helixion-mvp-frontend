'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { DateSortKey, SortDir } from '@/hooks/useSortedPagination';

export function SortIcon({ col, sortKey, sortDir }: { col: DateSortKey; sortKey: DateSortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="inline w-3 h-3 ml-1 opacity-40" />;
  return sortDir === 'asc'
    ? <ChevronUp className="inline w-3 h-3 ml-1" />
    : <ChevronDown className="inline w-3 h-3 ml-1" />;
}

export function withSortableDateColumns<C extends { key: string; header: React.ReactNode }>(
  columns: C[],
  sortKey: DateSortKey | null,
  sortDir: SortDir,
  onSort: (key: DateSortKey) => void
): C[] {
  return columns.map((col) => {
    if (col.key !== 'fromDate' && col.key !== 'toDate') return col;
    const key = col.key as DateSortKey;
    return {
      ...col,
      header: (
        <button
          onClick={() => onSort(key)}
          className="flex items-center gap-0.5 uppercase tracking-wider text-[10px] font-bold text-textSidebarMuted hover:text-white transition-colors"
        >
          {col.header}
          <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
        </button>
      ),
    };
  });
}
