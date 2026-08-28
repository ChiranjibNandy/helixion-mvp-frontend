'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface PaginatedFetchResult<T> {
  success: boolean;
  data?: T[];
  meta?: { totalPages?: number };
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Shared implementation behind every "search + paginate a list" hook in the
 * admin dashboard (users, organizations, ...). Previously each one
 * hand-rolled the same loading/error/page/totalPages state and the same
 * stale-response race guard (a slower, earlier request's response landing
 * after a faster, later one and overwriting it) — which is exactly the kind
 * of drift that let a new hook (useEmployeeDetail) ship without the guard
 * in the first place. New list hooks should build on this instead of
 * copying useUsersSearch/useOrganizationsList's old bodies.
 */
export function usePaginatedList<T>(
  fetchPage: (query: string, page: number, limit: number) => Promise<PaginatedFetchResult<T>>,
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const latestRequestId = useRef(0);

  const fetchItems = useCallback(async (searchQuery: string, targetPage: number) => {
    const requestId = ++latestRequestId.current;
    try {
      setLoading(true);
      setError(null);

      const result = await fetchPage(searchQuery, targetPage, pageSize);
      if (requestId !== latestRequestId.current) return; // superseded — drop it

      if (result.success && result.data) {
        setItems(result.data);
        setTotalPages(result.meta?.totalPages || 1);
      } else {
        setItems([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      if (requestId !== latestRequestId.current) return;
      setError(err.response?.data?.message || err.message || 'Unknown error');
      setItems([]);
      setTotalPages(1);
    } finally {
      if (requestId === latestRequestId.current) setLoading(false);
    }
    // Callers should wrap fetchPage in useCallback with stable deps (e.g.
    // []) — otherwise this identity changes every render and re-triggers
    // the effect below on every render too.
  }, [fetchPage, pageSize]);

  // New search always starts back at page 1
  const search = useCallback((searchQuery: string = '') => {
    setQuery(searchQuery);
    setPage(1);
    fetchItems(searchQuery, 1);
  }, [fetchItems]);

  const goToPage = useCallback((targetPage: number) => {
    setPage(targetPage);
    fetchItems(query, targetPage);
  }, [fetchItems, query]);

  useEffect(() => {
    fetchItems('', 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, page, totalPages, search, goToPage };
}
