import { useQuery } from "@tanstack/react-query";
import { getRegistrations } from "@/lib/api/registrations";

export const roleStatsKeys = {
  stats: ["roles", "stats"] as const,
};

export function useRolesStats() {
  return useQuery({
    queryKey: roleStatsKeys.stats,
    queryFn: async () => {
      // In a real production app, this would ideally be a dedicated /admin/stats endpoint.
      // Here we run parallel queries with limit=1 to gently get the metric sums.
      const [empRes, tpRes, mgrRes, adminRes] = await Promise.all([
        getRegistrations({ role: "employee", limit: 1 }),
        getRegistrations({ role: "training_provider", limit: 1 }),
        getRegistrations({ role: "manager", limit: 1 }),
        getRegistrations({ role: "admin", limit: 1 }),
      ]);

      return {
        employees: empRes.total,
        trainingProviders: tpRes.total,
        managers: mgrRes.total,
        admins: adminRes.total,
      };
    },
    staleTime: 60_000, // Cache stats for a minute
  });
}
