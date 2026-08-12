'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';

interface ChainPerson {
  name: string;
  email: string;
}

export interface UserSearchResult {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // reporting chain (merged in from the former Employee Directory page)
  reportingManager?: ChainPerson | null;
  skipLevel1Manager?: ChainPerson | null;
  skipLevel2Manager?: ChainPerson | null;
}

const PAGE_SIZE = 10;

export function useUsersSearch() {
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async (searchQuery: string, targetPage: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await userService.searchUsers(searchQuery, targetPage, PAGE_SIZE);

      if (result.success && result.data) {
        setUsers(result.data);
        setTotalPages(result.meta?.totalPages || 1);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unknown error');
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // New search always starts back at page 1
  const searchUsers = useCallback((searchQuery: string = '') => {
    setQuery(searchQuery);
    setPage(1);
    fetchUsers(searchQuery, 1);
  }, [fetchUsers]);

  const goToPage = useCallback((targetPage: number) => {
    setPage(targetPage);
    fetchUsers(query, targetPage);
  }, [fetchUsers, query]);

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

  const activateUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await userService.activateUser(id);

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
    fetchUsers('', 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    users,
    loading,
    error,
    page,
    totalPages,
    searchUsers,
    goToPage,
    deactivateUser,
    activateUser,
  };
}
