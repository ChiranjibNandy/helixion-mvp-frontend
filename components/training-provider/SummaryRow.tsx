import { TableRow, TableCell } from "@/components/ui/table";
import en from "@/message/en.json";

const t = en.dailyAttendanceGrid;

interface SummaryRowProps {
  dateRange: string[];
  byDay: Record<string, { present: number; absent: number; pending: number }>;
}

export function SummaryRow({ dateRange, byDay }: SummaryRowProps) {
  return (
    <TableRow className="border-t-2 border-[#333b45] bg-white/[0.02] hover:bg-white/[0.02]">
      <TableCell className="text-xs font-semibold text-white/60">{t.dailyTotals}</TableCell>
      {dateRange.map((date) => {
        const day = byDay[date] ?? { present: 0, absent: 0, pending: 0 };
        return (
          <TableCell key={date} className="p-1 text-center text-[10px] leading-tight">
            <div className="text-emerald-400">{day.present}</div>
            <div className="text-red-400">{day.absent}</div>
          </TableCell>
        );
      })}
      <TableCell colSpan={4} />
    </TableRow>
  );
}
