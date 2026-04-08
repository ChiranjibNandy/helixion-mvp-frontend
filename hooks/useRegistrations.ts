'use client';

import { useState, useEffect } from 'react';
import { FormattedRegistration } from '@/types/admin';
import { transformRegistrationData, isValidApiResponse } from '@/utils/adminHelpers';
import { API_ENDPOINTS } from '@/constants/admin';
import { getToken } from '@/utils/token';
import { FORM_ERRORS, AUTH_ERRORS, NETWORK_ERRORS } from '@/constants/errors';

interface UseRegistrationsReturn {
  registrations: FormattedRegistration[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Custom hook for fetching and managing registration data
 * Implements proper error handling with user-friendly messages
 */
export const useRegistrations = (): UseRegistrationsReturn => {
  const [registrations, setRegistrations] = useState<FormattedRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          setError(NETWORK_ERRORS.SERVER_ERROR);
          setLoading(false);
          return;
        }

        const token = getToken();

        if (!token) {
          setError(AUTH_ERRORS.TOKEN_MISSING);
          setLoading(false);
          return;
        }

        const response = await fetch(`${apiUrl}${API_ENDPOINTS.REGISTRATIONS}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError(AUTH_ERRORS.SESSION_EXPIRED);
          } else if (response.status >= 500) {
            setError(NETWORK_ERRORS.SERVER_ERROR);
          } else {
            setError(FORM_ERRORS.DATA_LOAD_FAILED);
          }
          setLoading(false);
          return;
        }

        const result = await response.json();

        if (!isValidApiResponse<unknown[]>(result) || !result.success) {
          setError(FORM_ERRORS.DATA_LOAD_FAILED);
          setLoading(false);
          return;
        }

        const formattedData = transformRegistrationData(result.data);
        setRegistrations(formattedData);
        setError(null);
      } catch {
        setError(NETWORK_ERRORS.CONNECTION_FAILED);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [retryCount]);

  const retry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return { registrations, loading, error, retry };
};
