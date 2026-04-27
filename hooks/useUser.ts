'use client';

import { getUsersAPI } from "@/utils/adminService";
import { useEffect, useState } from "react";


export function useUsers(page: number, limit: number, search: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await getUsersAPI({ page, limit, search });
      console.log(res)

      setData(res.data.data.users);
      setTotalPages(res.data.data.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search]);

  return { data, loading, totalPages, refetch: fetchUsers };
}