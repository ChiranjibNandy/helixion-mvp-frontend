'use client';

import { useEffect, useState } from "react";
import { getEnrollmentApprovalsAPI } from "@/services/enrollmentApprovalService";

export function useEnrollmentApprovals() {

   const [loading, setLoading] = useState(false);

   const [data, setData] = useState([]);

   const [page, setPage] = useState(1);

   const [limit] = useState(10);

   const [search, setSearch] = useState("");

   const [totalPages, setTotalPages] = useState(1);

   const fetchData = async () => {

      try {

         setLoading(true);

         const res = await getEnrollmentApprovalsAPI({
            page,
            limit,
            search,
         });
         console.log(res)

         setData(res.data.data);

         setTotalPages(res.data.pagination.totalPages);

      } finally {

         setLoading(false);

      }

   };

   useEffect(() => {

      fetchData();

   }, [page, search]);

   return {
      loading,
      data,
      page,
      totalPages,
      search,
      setPage,
      setSearch,
      refresh: fetchData,
   };
}