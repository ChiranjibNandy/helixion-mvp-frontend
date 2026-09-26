"use client";

import React, { useCallback, KeyboardEvent } from "react";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getDayStatus } from "@/utils/attendanceDate";
import { AttendanceDayEntry, AttendanceDayStatus } from "@/services/attendanceService";

interface AttendanceCellProps {
  date: string;
  entry: AttendanceDayEntry | null;
  saving: boolean;
  onChange: (status: AttendanceDayStatus | null) => void;
}

// Click: Empty -> Present -> Absent -> Empty. Keyboard: P/A/Delete.
export function AttendanceCell({ date, entry, saving, onChange }: AttendanceCellProps) {
  const { isEditable, isToday, isFuture } = getDayStatus(date);
  const status = entry?.status ?? null;

  const cycle = useCallback(() => {
    if (!isEditable || saving) return;
    const next: AttendanceDayStatus | null = status === "present" ? "absent" : status === "absent" ? null : "present";
    onChange(next);
  }, [isEditable, saving, status, onChange]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isEditable || saving) return;
    const key = event.key.toLowerCase();
    if (key === "p") onChange("present");
    else if (key === "a") onChange("absent");
    else if (key === "delete" || key === "backspace") onChange(null);
  };

  return (
    <TableCell
      className={cn(
        "w-12 select-none p-0 text-center",
        isFuture && "bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.04)_4px,rgba(255,255,255,0.04)_8px)]",
        isToday && "ring-1 ring-inset ring-yellow-400/60"
      )}
      title={isFuture ? "Future date — locked until it arrives" : undefined}
    >
      <div
        role="button"
        aria-label={`Attendance for ${date}`}
        tabIndex={isEditable ? 0 : -1}
        onClick={cycle}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-9 w-full items-center justify-center text-sm font-semibold outline-none",
          isEditable ? "cursor-pointer hover:bg-white/5" : "cursor-not-allowed text-white/20",
          status === "present" && "text-emerald-400",
          status === "absent" && "text-red-400",
          saving && "opacity-40"
        )}
      >
        {status === "present" ? "✓" : status === "absent" ? "✗" : isFuture ? "—" : ""}
      </div>
    </TableCell>
  );
}
