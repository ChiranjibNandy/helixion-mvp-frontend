'use client';

import { useEffect, useState } from "react";
import { getEnrollmentApprovalsAPI } from "@/services/enrollmentApprovalService";
import { EnrollmentApproval } from "@/types/enrollment";

export function useEnrollmentApprovals() {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState<EnrollmentApproval[]>([]);
   const [error, setError] = useState<string | null>(null);

   const [page, setPage] = useState(1);
   const [limit] = useState(10);
   const [search, setSearch] = useState("");
   const [totalPages, setTotalPages] = useState(1);

   const fetchData = async () => {
      try {
         setLoading(true);
         setError(null);

         const res = await getEnrollmentApprovalsAPI({
            page,
            limit,
            search,
         });

         setData(res.data.data);
         setTotalPages(res.data.pagination.totalPages);
      } catch (err: any) {
         console.error("Failed to fetch enrollment approvals:", err);

         setError(
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong"
         );

         setData([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, [page, search]);

   return {
      loading,
      error,
      data,
      page,
      totalPages,
      search,
      setPage,
      setSearch,
      refresh: fetchData,
   };
}