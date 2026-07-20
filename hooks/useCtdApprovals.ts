"use client";

import { useEffect, useState } from "react";
import { getCtdPendingEnrollmentsAPI } from "@/services/enrollmentApprovalService";
import { EnrollmentApproval } from "@/types/enrollment";

export function useCtdApprovals() {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState<EnrollmentApproval[]>([]);
   const [error, setError] = useState<string | null>(null);

   const fetchData = async () => {
      try {
         setLoading(true);
         setError(null);

         const res = await getCtdPendingEnrollmentsAPI();
         setData(res.data || []);
      } catch (err: any) {
         console.error("Failed to fetch CTD pending enrollments:", err);

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
   }, []);

   return {
      loading,
      error,
      data,
      refresh: fetchData,
   };
}
