'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getEmployeeAPI, EmployeeDetail } from '@/services/adminService';

export function useEmployeeDetail(id: string) {
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Same stale-response guard as useUsersSearch/useOrganizationsList — if
  // `id` changes before the previous fetch resolves (e.g. the route reuses
  // this component while navigating between two employees), an
  // out-of-order response must not overwrite the current one.
  const latestRequestId = useRef(0);

  const fetchEmployee = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    try {
      setLoading(true);
      setError(null);

      const response = await getEmployeeAPI(id);
      if (requestId !== latestRequestId.current) return;
      setEmployee(response.data?.data ?? null);
    } catch (err: any) {
      if (requestId !== latestRequestId.current) return;
      setError(err?.response?.data?.message || err?.message || 'Failed to load employee');
      setEmployee(null);
    } finally {
      if (requestId === latestRequestId.current) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return { employee, loading, error, refetch: fetchEmployee };
}
