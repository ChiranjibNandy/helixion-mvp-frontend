"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import en from "@/message/en.json";
import {
  attendanceService,
  AttendanceGridResponse,
  AttendanceEnrollmentRow,
  AttendanceDayStatus,
} from "@/services/attendanceService";

const t = en.dailyAttendanceGrid;

const PAGE_SIZE = 50;

const recomputeRow = (row: AttendanceEnrollmentRow, totalDays: number): AttendanceEnrollmentRow => {
  const days = Object.values(row.attendanceByDay);
  const totalPresent = days.filter((d) => d?.status === "present").length;
  const totalAbsent = days.filter((d) => d?.status === "absent").length;
  const totalPending = totalDays - totalPresent - totalAbsent;
  return { ...row, totalPresent, totalAbsent, totalPending, isComplete: totalPending === 0 };
};


const shiftSummaryByDay = (
  byDay: AttendanceGridResponse["summary"]["byDay"],
  date: string,
  fromStatus: AttendanceDayStatus | null,
  toStatus: AttendanceDayStatus | null
) => {
  if (fromStatus === toStatus) return byDay;
  const day = byDay[date] ?? { present: 0, absent: 0, pending: 0 };
  const next = { ...day };

  if (fromStatus === "present") next.present--;
  else if (fromStatus === "absent") next.absent--;
  else next.pending--;

  if (toStatus === "present") next.present++;
  else if (toStatus === "absent") next.absent++;
  else next.pending++;

  return { ...byDay, [date]: next };
};


export function useAttendanceGrid(programId: string) {
  const [data, setData] = useState<AttendanceGridResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearchValue] = useState("");
  const [page, setPageValue] = useState(1);
  const [savingCells, setSavingCells] = useState<Set<string>>(new Set());

  const latestRequestId = useRef(0);

  const fetchGrid = useCallback(
    async (searchQuery: string, pageNumber: number) => {
      const requestId = ++latestRequestId.current;
      try {
        setLoading(true);
        setError(null);
        const result = await attendanceService.getAttendanceGrid(programId, {
          search: searchQuery,
          page: pageNumber,
          limit: PAGE_SIZE,
        });
        if (requestId !== latestRequestId.current) return;
        setData(result);
      } catch (err: any) {
        if (requestId !== latestRequestId.current) return;
        setError(err.response?.data?.message || err.message || t.errorLoadGrid);
      } finally {
        if (requestId === latestRequestId.current) setLoading(false);
      }
    },
    [programId]
  );

  useEffect(() => {
    if (programId) fetchGrid("", 1);
    
  }, [programId]);

  const search_ = useCallback(
    (query: string) => {
      setSearchValue(query);
      setPageValue(1);
      fetchGrid(query, 1);
    },
    [fetchGrid]
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setPageValue(nextPage);
      fetchGrid(search, nextPage);
    },
    [fetchGrid, search]
  );

  const setCellStatus = useCallback(
    async (enrollmentId: string, date: string, nextStatus: AttendanceDayStatus | null) => {
      const cellKey = `${enrollmentId}:${date}`;
      let previousRow: AttendanceEnrollmentRow | undefined;
      let previousStatus: AttendanceDayStatus | null = null;

      setError(null);
      setData((prev) => {
        if (!prev) return prev;
        const enrollments = prev.enrollments.map((row) => {
          if (row.enrollmentId !== enrollmentId) return row;
          previousRow = row;
          previousStatus = row.attendanceByDay[date]?.status ?? null;
          const attendanceByDay = {
            ...row.attendanceByDay,
            [date]: nextStatus ? { status: nextStatus, markedAt: new Date().toISOString() } : null,
          };
          return recomputeRow({ ...row, attendanceByDay }, prev.programDates.totalDays);
        });
        return {
          ...prev,
          enrollments,
          summary: {
            ...prev.summary,
            byDay: shiftSummaryByDay(prev.summary.byDay, date, previousStatus, nextStatus),
          },
        };
      });

      setSavingCells((prev) => new Set(prev).add(cellKey));
      try {
        await attendanceService.markAttendanceDay(programId, enrollmentId, date, nextStatus);
      } catch (err) {
        if (previousRow) {
          const rolledBackRow = previousRow;
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  enrollments: prev.enrollments.map((row) =>
                    row.enrollmentId === enrollmentId ? rolledBackRow : row
                  ),
                  summary: {
                    ...prev.summary,
                    byDay: shiftSummaryByDay(prev.summary.byDay, date, nextStatus, previousStatus),
                  },
                }
              : prev
          );
        }
        setError(t.errorSaveDay);
      } finally {
        setSavingCells((prev) => {
          const next = new Set(prev);
          next.delete(cellKey);
          return next;
        });
      }
    },
    [programId]
  );

  const updateNotes = useCallback(
    async (enrollmentId: string, notes: string) => {
      let previousNotes: string | undefined;

      setError(null);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          enrollments: prev.enrollments.map((row) => {
            if (row.enrollmentId !== enrollmentId) return row;
            previousNotes = row.notes;
            return { ...row, notes };
          }),
        };
      });

      try {
        await attendanceService.updateAttendanceNotes(programId, enrollmentId, notes);
      } catch (err) {
        if (previousNotes !== undefined) {
          const rolledBackNotes = previousNotes;
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  enrollments: prev.enrollments.map((row) =>
                    row.enrollmentId === enrollmentId ? { ...row, notes: rolledBackNotes } : row
                  ),
                }
              : prev
          );
        }
        setError(t.errorSaveNotes);
      }
    },
    [programId]
  );

  const refresh = useCallback(() => fetchGrid(search, page), [fetchGrid, search, page]);

  const isSaving = useCallback(
    (enrollmentId: string, date: string) => savingCells.has(`${enrollmentId}:${date}`),
    [savingCells]
  );

  return {
    data,
    loading,
    error,
    search,
    setSearch: search_,
    page,
    totalPages: data?.pagination.totalPages ?? 1,
    setPage,
    setCellStatus,
    updateNotes,
    refresh,
    isSaving,
  };
}
