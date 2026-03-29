import { useQuery } from "@tanstack/react-query";
import { getRegistrations } from "@/lib/api/registrations";

export const recentActivityKeys = {
  list: ["dashboard", "recent-activity"] as const,
};

export function useRecentActivity(limit = 8) {
  return useQuery({
    queryKey: [...recentActivityKeys.list, limit] as const,
    queryFn: () => getRegistrations({ page: 1, limit }),
    staleTime: 60_000,
    select: (res) => res.users,
  });
}
