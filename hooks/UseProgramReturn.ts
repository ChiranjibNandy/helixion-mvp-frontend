"use client";

import { useCallback, useEffect, useState } from "react";
import { getProgramsAPI } from "@/services/programService";
import { NETWORK_ERRORS } from "@/constants/errors";
import { Program } from "@/types/program";
import { Pagination } from "@/types/pagination";

interface UseProgramsReturn {
  programs: Program[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  search: string;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export const usePrograms = (): UseProgramsReturn => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  const fetchPrograms = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getProgramsAPI({
        page,
        limit,
        search,
      });

      setPrograms(response.data.data);
      setPagination(response.data.meta);
      setError(null);
    } catch {
      setError(NETWORK_ERRORS.CONNECTION_FAILED);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    programs,
    loading,
    error,
    pagination,
    search,
    setSearch: handleSearch,
    setPage,
    refetch: fetchPrograms,
  };
};