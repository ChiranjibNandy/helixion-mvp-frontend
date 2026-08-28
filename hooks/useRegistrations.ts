'use client';

import { useState, useEffect, useCallback } from 'react';
import { FormattedRegistration } from '@/types/admin';
import { transformRegistrationData } from '@/utils/adminHelpers';
import { NETWORK_ERRORS } from '@/constants/errors';
import { getPendingUserAPI } from '@/services/adminService';
import { Pagination } from '@/types/pagination';

interface UseRegistrationsReturn {
  registrations: FormattedRegistration[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  pagination: Pagination | null;
  setPage: (page: number) => void;
}

export const useRegistrations = (): UseRegistrationsReturn => {
  const [registrations, setRegistrations] = useState<FormattedRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPendingUserAPI(page, limit);

      const formattedData = transformRegistrationData(
        response.data.data
      );

      setRegistrations(formattedData);
      setPagination(response.data.meta);
      setError(null);
    } catch {
      setError(NETWORK_ERRORS.CONNECTION_FAILED);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return {
    registrations,
    loading,
    error,
    refetch: fetchRegistrations,
    pagination,
    setPage,
  };
};