'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getOrganizationByIdAPI, OrganizationDetail } from '@/services/adminService';

/** Fetches the admin's own org by id. Pass `null` while the id isn't known
 *  yet (e.g. still waiting on the org-status check) — the fetch is skipped. */
export function useOrganizationDetails(id: string | null) {
  const [organization, setOrganization] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const latestRequestId = useRef(0);

  const fetchOrganization = useCallback(async () => {
    if (!id) {
      setOrganization(null);
      setLoading(false);
      return;
    }

    const requestId = ++latestRequestId.current;
    try {
      setLoading(true);
      setError(null);

      const response = await getOrganizationByIdAPI(id);
      if (requestId !== latestRequestId.current) return;
      setOrganization(response.data?.data ?? null);
    } catch (err: any) {
      if (requestId !== latestRequestId.current) return;
      setError(err?.response?.data?.message || err?.message || 'Failed to load organization');
      setOrganization(null);
    } finally {
      if (requestId === latestRequestId.current) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return { organization, loading, error, refetch: fetchOrganization };
}
