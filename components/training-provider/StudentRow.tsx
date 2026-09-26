"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { AttendanceCell } from "./AttendanceCell";
import { NotesCell } from "./NotesCell";
import { AttendanceEnrollmentRow, AttendanceDayStatus } from "@/services/attendanceService";

interface StudentRowProps {
  index: number;
  row: AttendanceEnrollmentRow;
  dateRange: string[];
  isSaving: (enrollmentId: string, date: string) => boolean;
  onCellChange: (enrollmentId: string, date: string, status: AttendanceDayStatus | null) => void;
  onNotesSave: (enrollmentId: string, notes: string) => void;
}

export function StudentRow({ index, row, dateRange, isSaving, onCellChange, onNotesSave }: StudentRowProps) {
  return (
    <TableRow className="border-[#333b45] hover:bg-[#2a3038]">
      <TableCell className="whitespace-nowrap font-medium text-white">
        {index + 1}. {row.employeeName}
        <div className="text-xs text-white/40">
          {row.employeeEmail}
          {row.department ? ` · ${row.department}` : ""}
        </div>
      </TableCell>

      {dateRange.map((date) => (
        <AttendanceCell
          key={date}
          date={date}
          entry={row.attendanceByDay[date] ?? null}
          saving={isSaving(row.enrollmentId, date)}
          onChange={(status) => onCellChange(row.enrollmentId, date, status)}
        />
      ))}

      <TableCell className="text-center text-emerald-400">{row.totalPresent}</TableCell>
      <TableCell className="text-center text-red-400">{row.totalAbsent}</TableCell>
      <TableCell className="text-center text-white/40">{row.totalPending}</TableCell>

      <NotesCell value={row.notes} onSave={(notes) => onNotesSave(row.enrollmentId, notes)} />
    </TableRow>
  );
}
