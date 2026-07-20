"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import en from "@/message/en.json";
import { attendanceService, Program } from "@/services/attendanceService";
import { ProgramListTable } from "@/components/dashboard/update-attendance/ProgramListTable";
import { ROUTES } from "@/constants/navigation";

export function UpdateAttendanceListPage() {
  const t = en.updateAttendance;
  const router = useRouter();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPrograms();
  }, [page, limit]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getPrograms(page, limit);
      const payload = res.data ?? res;
      const allPrograms = payload.programs ?? [];

      setPrograms(allPrograms);
      setTotal(payload.total ?? 0);
    } catch (error) {
      console.error("Failed to fetch programs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedProgramId(id === selectedProgramId ? null : id);
  };

  const handleUpdateClick = () => {
    if (selectedProgramId) {
      router.push(`${ROUTES.PROVIDER.ATTENDANCE}/${selectedProgramId}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-[#333b45] p-6 text-card-foreground min-h-[600px]">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-lg font-semibold">{t.pageTitle}</h2>
      </div>

      <ProgramListTable
        programs={programs}
        loading={loading}
        selectedProgramId={selectedProgramId}
        onSelectProgram={handleSelect}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onUpdateClick={handleUpdateClick}
        t={t}
      />
    </div>
  );
}
