export const toDateString = (date: Date | string): string => new Date(date).toISOString().slice(0, 10);

export const todayDateString = (): string => toDateString(new Date());

export interface DayStatus {
  isEditable: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export function getDayStatus(dateStr: string): DayStatus {
  const today = todayDateString();
  const isFuture = dateStr > today;
  return {
    isEditable: !isFuture,
    isToday: dateStr === today,
    isFuture,
  };
}

// Inclusive list of "YYYY-MM-DD" strings from start to end.
export function getDateRange(start: string, end: string): string[] {
  const days: string[] = [];
  const cursor = new Date(toDateString(start));
  const endDate = new Date(toDateString(end));

  while (cursor <= endDate) {
    days.push(toDateString(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

export function formatDayLabel(dateStr: string): { weekday: string; day: string } {
  const date = new Date(dateStr);
  return {
    weekday: date.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }),
    day: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }),
  };
}
