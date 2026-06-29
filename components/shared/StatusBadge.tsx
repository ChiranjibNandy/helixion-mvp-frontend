'use client';

import Badge from "../ui/badge";

const statusMap = {
  // Original statuses
  enrolled: "active",
  approved: "active",
  pending: "pending",
  "pending approval": "pending",
  open: "draft",
  rejected: "draft",
  completed: "completed",

  // Bulk import statuses
  valid: "active",
  warning: "pending",

  // Roles
  admin: "active",
  employee: "pending",
  "training-provider": "completed",

  // Actions
  create: "active",
  update: "in_progress",
  none: "draft",
} as const;

export function StatusBadge({ status }: { status: string }) {
  const norm = (status || "").toLowerCase();
  
  if (norm === "error") {
    return <Badge variant="destructive" className="capitalize">{status}</Badge>;
  }

  const mappedStatus =
    statusMap[norm as keyof typeof statusMap] ?? "draft";

  return <Badge status={mappedStatus} className="capitalize">{status}</Badge>;
}