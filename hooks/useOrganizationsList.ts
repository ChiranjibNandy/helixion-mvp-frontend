'use client';

import { useCallback } from 'react';
import { getOrganizationsAPI } from '@/services/adminService';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export interface OrganizationListItem {
  id: string;
  name: string;
  slug: string;
  orgType: string;
  status: string;
  createdAt: string;
}

const PAGE_SIZE = 10;

export function useOrganizationsList() {
  const fetchPage = useCallback(async (query: string, page: number, limit: number) => {
    const response = await getOrganizationsAPI({ page, limit, search: query });
    return response.data;
  }, []);

  const { items: organizations, loading, error, page, totalPages, search, goToPage } =
    usePaginatedList<OrganizationListItem>(fetchPage, PAGE_SIZE);

  return { organizations, loading, error, page, totalPages, search, goToPage };
}
