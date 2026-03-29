import { useQuery } from "@tanstack/react-query";
import {
  getRegistrations,
  type GetRegistrationsOptions,
} from "@/lib/api/registrations";
import type { PaginatedResponse } from "@/types/registration";

export const dashboardKeys = {
  stats: ["dashboard", "stats"] as const,
};

async function safeRegistrations(
  label: string,
  opts: GetRegistrationsOptions
): Promise<PaginatedResponse> {
  try {
    return await getRegistrations(opts);
  } catch (e) {
    console.error(`[useDashboardStats] ${label} failed`, e);
    return { users: [], total: 0, page: 1, limit: opts.limit ?? 10 };
  }
}

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: async () => {
      // In a real production app, this would ideally be a dedicated /admin/stats endpoint.
      // Here we run parallel queries with limit=1 (or 5 for pending list) to get counts
      // to populate the dashboard dynamically. Each call is isolated so one filter error
      // does not blank the whole dashboard.
      const [allRes, pendingRes, deactivatedRes] = await Promise.all([
        safeRegistrations("total", { limit: 1 }),
        safeRegistrations("pending", { status: "pending", limit: 5 }),
        safeRegistrations("deactivated", { status: "denied", limit: 1 }),
      ]);

      return {
        totalUsers: allRes.total,
        pendingApproval: pendingRes.total,
        deactivated: deactivatedRes.total,
        pendingList: pendingRes.users,
      };
    },
    staleTime: 60_000, // Cache dashboard stats for a minute to prevent spamming
  });
}
