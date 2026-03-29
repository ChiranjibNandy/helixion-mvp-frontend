import { useQuery } from "@tanstack/react-query";
import { getRegistrations } from "@/lib/api/registrations";

export const dashboardKeys = {
  stats: ["dashboard", "stats"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: async () => {
      // In a real production app, this would ideally be a dedicated /admin/stats endpoint.
      // Here we run parallel queries with limit=1 (or 5 for pending list) to get counts
      // to populate the dashboard dynamically.
      const [allRes, pendingRes, deactivatedRes] = await Promise.all([
        getRegistrations({ limit: 1 }),
        getRegistrations({ status: "pending", limit: 5 }), // Grab 5 for the PendingPanel
        getRegistrations({ status: "denied", limit: 1 }),
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
