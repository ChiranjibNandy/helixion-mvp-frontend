import Papa from "papaparse";
import { AttendanceEnrollmentRow } from "@/services/attendanceService";
import { formatDayLabel } from "@/utils/attendanceDate";

const STATUS_LABEL: Record<string, string> = {
  present: "Present",
  absent: "Absent",
};

export function exportAttendanceCsv(
  programTitle: string,
  dateRange: string[],
  enrollments: AttendanceEnrollmentRow[]
) {
  const records = enrollments.map((row) => {
    const record: Record<string, string> = {
      Name: row.employeeName,
      Email: row.employeeEmail,
      Department: row.department,
    };
    for (const date of dateRange) {
      record[formatDayLabel(date).day] = STATUS_LABEL[row.attendanceByDay[date]?.status ?? ""] ?? "Pending";
    }
    record["Total Present"] = String(row.totalPresent);
    record["Total Absent"] = String(row.totalAbsent);
    record["Notes"] = row.notes;
    return record;
  });

  const csv = Papa.unparse(records);
  const fileName = `${programTitle.replace(/[^a-z0-9]+/gi, "_")}_attendance.csv`;
  const blob = new Blob([csv], { type: "text/csv" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
