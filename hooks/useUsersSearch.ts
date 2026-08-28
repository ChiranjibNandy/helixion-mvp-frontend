'use client';

import { useState, useCallback } from 'react';
import { userService } from '@/services/userService';
import { usePaginatedList } from '@/hooks/usePaginatedList';

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
  const fetchPage = useCallback(async (query: string, page: number, limit: number) => {
    return await userService.searchUsers(query, page, limit);
  }, []);

  const { items: users, loading: listLoading, error, page, totalPages, search: searchUsers, goToPage } =
    usePaginatedList<UserSearchResult>(fetchPage, PAGE_SIZE);

  // Separate from the list's own loading — deactivate/activate shouldn't
  // wait on or be confused with a concurrent search, but the page still
  // wants ONE `loading` flag to disable its confirm button either way, so
  // the two are combined in the return value below.
  const [mutationLoading, setMutationLoading] = useState(false);

  // Deliberately don't touch `error` here — that state gates whether the
  // results table renders, and a failed toggle shouldn't wipe out an
  // already-loaded user list. The caller surfaces toggle failures via a
  // toast instead.
  const deactivateUser = async (id: string) => {
    try {
      setMutationLoading(true);
      const result = await userService.deactivateUser(id);
      return result.success;
    } catch (err: any) {
      return false;
    } finally {
      setMutationLoading(false);
    }
  };

  const activateUser = async (id: string) => {
    try {
      setMutationLoading(true);
      const result = await userService.activateUser(id);
      return result.success;
    } catch (err: any) {
      return false;
    } finally {
      setMutationLoading(false);
    }
  };

  return {
    users,
    loading: listLoading || mutationLoading,
    error,
    page,
    totalPages,
    searchUsers,
    goToPage,
    deactivateUser,
    activateUser,
  };
}
