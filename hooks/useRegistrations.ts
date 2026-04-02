'use client';

import { useState, useEffect } from 'react';
import { FormattedRegistration } from '@/types/admin';
import { transformRegistrationData, isValidApiResponse } from '@/utils/adminHelpers';
import { API_ENDPOINTS, COLOR_CLASSES } from '@/constants/admin';

interface UseRegistrationsReturn {
  registrations: FormattedRegistration[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching and managing registration data
 */
export const useRegistrations = (): UseRegistrationsReturn => {
  const [registrations, setRegistrations] = useState<FormattedRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('accessToken');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`${apiUrl}${API_ENDPOINTS.REGISTRATIONS}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (!isValidApiResponse(result) || !result.success) {
          throw new Error(result.message || 'Failed to fetch registrations');
        }

        const formattedData = transformRegistrationData(result.data as unknown[]);
        setRegistrations(formattedData);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return { registrations, loading, error };
};
