"use client";

import { useEffect, useState } from "react";
import { getTourApprovalsAPI, getOsdTourApprovalsAPI } from "@/services/enrollmentApprovalService";

export function useTourApprovals(type: "manager" | "osd") {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState<any[]>([]);
   const [error, setError] = useState<string | null>(null);

   const fetchData = async () => {
      try {
         setLoading(true);
         setError(null);

         const res = type === "manager" 
            ? await getTourApprovalsAPI() 
            : await getOsdTourApprovalsAPI();

         setData(res.data || []);
      } catch (err: any) {
         console.error("Failed to fetch tour approvals:", err);

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
   }, [type]);

   return {
      loading,
      error,
      data,
      refresh: fetchData,
   };
}
