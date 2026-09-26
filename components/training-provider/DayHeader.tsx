import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDayLabel, getDayStatus } from "@/utils/attendanceDate";

export function DayHeader({ date }: { date: string }) {
  const { weekday, day } = formatDayLabel(date);
  const { isToday, isFuture } = getDayStatus(date);

  return (
    <TableHead
      className={cn("w-12 px-1 text-center", isToday && "bg-yellow-400/10", isFuture && "text-white/30")}
      title={isToday ? "Today" : undefined}
    >
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase text-white/40">{weekday}</span>
        <span className="text-xs">{day}</span>
      </div>
    </TableHead>
  );
}
