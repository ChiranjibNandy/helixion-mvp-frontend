'use client';

import { getUsersAPI } from "@/utils/adminService";
import { useEffect, useState } from "react";

export function useUsers(page: number, limit: number, search: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // reset previous error

    try {
      const res = await getUsersAPI({ page, limit, q:search });

      setData(res?.data?.data?.users || []);
      setTotalPages(res?.data?.data?.pagination?.totalPages || 1);
    } catch (err: any) {
      console.error("Fetch users error:", err);

      setError(
        err?.response?.data?.message ||
        "Failed to fetch users. Please try again."
      );

      setData([]); // fallback to empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search]);

  return { data, loading, totalPages, error, refetch: fetchUsers };
}