"use client";

import React, { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import en from "@/message/en.json";
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import PaginationController from "@/components/ui/pagination";
import { ROUTES } from "@/constants/navigation";
import { useAttendanceGrid } from "@/hooks/useAttendanceGrid";
import { getDateRange } from "@/utils/attendanceDate";
import { exportAttendanceCsv } from "@/utils/exportAttendanceCsv";
import { DayHeader } from "./DayHeader";
import { StudentRow } from "./StudentRow";
import { SummaryRow } from "./SummaryRow";

const t = en.dailyAttendanceGrid;

export function AttendanceGrid() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;

  const { data, loading, error, search, setSearch, page, totalPages, setPage, setCellStatus, updateNotes, isSaving } =
    useAttendanceGrid(programId);

  const dateRange = useMemo(
    () => (data ? getDateRange(data.programDates.start, data.programDates.end) : []),
    [data]
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#333b45] bg-card p-6 text-card-foreground">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{data?.programTitle ?? "Attendance"}</h2>
          {data && (
            <p className="mt-1 text-sm text-gray-400">
              {data.programDates.start} → {data.programDates.end} · {data.summary.totalEnrollments} enrollments
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder={t.searchPlaceholder} className="w-56" />
          <Button
            variant="outline"
            disabled={!data || data.enrollments.length === 0}
            onClick={() => data && exportAttendanceCsv(data.programTitle, dateRange, data.enrollments)}
          >
            {t.exportCsv}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-md border border-[#333b45]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#333b45] hover:bg-transparent">
                <TableHead>{t.columnName}</TableHead>
                {dateRange.map((date) => (
                  <DayHeader key={date} date={date} />
                ))}
                <TableHead className="w-12 text-center">{t.columnPresent}</TableHead>
                <TableHead className="w-12 text-center">{t.columnAbsent}</TableHead>
                <TableHead className="w-12 text-center">{t.columnPending}</TableHead>
                <TableHead>{t.columnNotes}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data || data.enrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={dateRange.length + 5} className="py-10 text-center">
                    {t.noEnrollments}
                  </TableCell>
                </TableRow>
              ) : (
                data.enrollments.map((row, index) => (
                  <StudentRow
                    key={row.enrollmentId}
                    index={index}
                    row={row}
                    dateRange={dateRange}
                    isSaving={isSaving}
                    onCellChange={setCellStatus}
                    onNotesSave={updateNotes}
                  />
                ))
              )}
            </TableBody>
            {data && data.enrollments.length > 0 && (
              <TableFooter>
                <SummaryRow dateRange={dateRange} byDay={data.summary.byDay} />
              </TableFooter>
            )}
          </Table>
        </div>
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="mt-4">
          <PaginationController page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.PROVIDER.ATTENDANCE)}
          className="border border-gray-500 bg-transparent text-white hover:bg-gray-800"
        >
          {t.backButton}
        </Button>
      </div>
    </div>
  );
}
