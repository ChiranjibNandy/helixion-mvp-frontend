'use client';

import { useState } from 'react';

export type DateSortKey = 'fromDate' | 'toDate';
export type SortDir = 'asc' | 'desc';

/**
 * Client-side sort + paginate for a dashboard's "pending items" preview
 * table (Manager, CTD, ...). Every one of these lists is a small, already-
 * fetched, date-bearing array — capped server-side, not the primary way to
 * browse (see the "View all" link to the real paginated queue page) — so
 * sorting/paginating in the browser is the right tradeoff, but the state and
 * slicing math were previously hand-rolled identically in both
 * ManagerDashboardView and CtdDashboardView. Centralized here so a third
 * dashboard doesn't copy them a third time.
 */
export function useSortedPagination<T extends { fromDate: string; toDate: string }>(
  rows: T[],
  pageSize: number
) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<DateSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: DateSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const cmp = a[sortKey].localeCompare(b[sortKey]);
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : rows;

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pagedRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  return { page, setPage, totalPages, pagedRows, sortKey, sortDir, handleSort };
}
