'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

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

      const result = await userService.searchUsers(query);

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

      const result = await userService.deactivateUser(id);

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
