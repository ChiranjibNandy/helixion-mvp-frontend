'use client';

import Badge from "../ui/badge";

const statusMap = {
  Enrolled: "active",
  Approved: "active",
  Pending: "pending",
  Open: "draft",
  Rejected: "draft",
  Completed: "completed",
} as const;


export function StatusBadge({ status }: { status: string }) {
  const mappedStatus =
    statusMap[status as keyof typeof statusMap] ?? "draft";

  return <Badge status={mappedStatus}>{status}</Badge>;
}