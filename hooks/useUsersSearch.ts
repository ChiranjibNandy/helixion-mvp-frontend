'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/constants/admin';
import { api } from '@/lib/api';

export interface UserSearchResult {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function useUsersSearch() {
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = async (query: string = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`${API_ENDPOINTS.USERS}?q=${encodeURIComponent(query)}&limit=10`);

      const result = response.data;
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unknown error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.patch(API_ENDPOINTS.DEACTIVATE_USER(id));

      const result = response.data;
      return result.success;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    searchUsers('');
  }, []);

  return {
    users,
    loading,
    error,
    searchUsers,
    deactivateUser,
  };
}
