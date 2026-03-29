import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, Role, PaginatedResponse, UserStatus } from "@/types/registration";
import { getRegistrations, approveUser } from "@/lib/api/registrations";
import { useDebounce } from "@/hooks/useDebounce";
import { REGISTRATIONS_PAGE_LIMIT } from "@/config/pagination";
import { dashboardKeys, type DashboardStatsData } from "@/hooks/useDashboardStats";
import { recentActivityKeys } from "@/hooks/useRecentActivity";

export const registrationKeys = {
  all: ["registrations"] as const,
  list: (page: number, search: string, status?: string) =>
    ["registrations", "list", page, search, status || "all"] as const,
};

interface ApproveMutationVariables {
  userId: string;
  role: Role;
  note?: string;
}

interface OptimisticContext {
  previousData: PaginatedResponse | undefined;
  snapshotKey: readonly ["registrations", "list", number, string, string];
  previousDashboard: DashboardStatsData | undefined;
}

export interface UseRegistrationsReturn {
  data: PaginatedResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  page: number;
  search: string;
  status: UserStatus | "all";
  selectedUsers: Set<string>;
  approveModalUser: User | null;
  isPendingApproval: boolean;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: UserStatus | "all") => void;
  handleApprove: (user: User) => void;
  handleConfirmApproval: (role: Role, note?: string) => void;
  handleCloseApproveModal: () => void;
  handleDeny: (userId: string) => void;
  handleToggleSelect: (userId: string) => void;
  handleToggleSelectAll: () => void;
}

export function useRegistrations(initialStatus: UserStatus | "all" = "all"): UseRegistrationsReturn {
  const [page, setPageState] = useState(1);
  const [search, setSearchState] = useState("");
  const [status, setStatusState] = useState<UserStatus | "all">(initialStatus);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [approveModalUser, setApproveModalUser] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPageState(1); // always reset to page 1 on new search
  }, []);

  const setStatus = useCallback((value: UserStatus | "all") => {
    setStatusState(value);
    setPageState(1); // always reset to page 1 on filter change
    setSelectedUsers(new Set()); // clear selections when swapping lists
  }, []);

  const setPage = useCallback((value: number) => {
    setPageState(value);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: registrationKeys.list(page, debouncedSearch, status),
    queryFn: () =>
      getRegistrations({ 
        page, 
        limit: REGISTRATIONS_PAGE_LIMIT, 
        search: debouncedSearch || undefined,
        status: status === "all" ? undefined : status
      }),
    staleTime: 30_000,
    retry: (failureCount, err) => {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status !== undefined && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });

  const approveMutation = useMutation<void, Error, ApproveMutationVariables, OptimisticContext>({
    mutationFn: ({ userId, role, note }) => approveUser(userId, { role, note }),

    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: registrationKeys.all });
      await queryClient.cancelQueries({ queryKey: dashboardKeys.stats });
      const snapshotKey = registrationKeys.list(page, debouncedSearch, status);
      const previousData = queryClient.getQueryData<PaginatedResponse>(snapshotKey);
      const previousDashboard = queryClient.getQueryData<DashboardStatsData>(
        dashboardKeys.stats
      );

      queryClient.setQueryData<PaginatedResponse>(snapshotKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          users: old.users.filter((u) => u.id !== userId),
          total: Math.max(0, old.total - 1),
        };
      });

      queryClient.setQueryData<DashboardStatsData>(dashboardKeys.stats, (old) => {
        if (!old) return old;
        return {
          ...old,
          pendingApproval: Math.max(0, old.pendingApproval - 1),
          pendingList: old.pendingList.filter((u) => u.id !== userId),
        };
      });

      return { previousData, snapshotKey, previousDashboard };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(context.snapshotKey, context.previousData);
      }
      if (context?.previousDashboard !== undefined) {
        queryClient.setQueryData(dashboardKeys.stats, context.previousDashboard);
      }
    },

    // Invalidate after every settle (success or error) to reconcile with server.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats });
      queryClient.invalidateQueries({ queryKey: recentActivityKeys.list });
    },
  });

  const handleApprove = useCallback((user: User) => {
    setApproveModalUser(user);
  }, []);

  const handleCloseApproveModal = useCallback(() => {
    setApproveModalUser(null);
  }, []);

  const handleConfirmApproval = useCallback(
    (role: Role, note?: string) => {
      if (!approveModalUser) return;
      const userId = approveModalUser.id;
      approveMutation.mutate(
        { userId, role, note },
        {
          onSuccess: () => {
            setApproveModalUser(null);
          },
        }
      );
    },
    [approveModalUser, approveMutation]
  );

  const handleDeny = useCallback((_userId: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[useRegistrations] handleDeny called but not yet implemented.");
    }
  }, []);

  const handleToggleSelect = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    if (!data?.users?.length) return;
    const allIds = data.users.map((u) => u.id);
    setSelectedUsers((prev) =>
      prev.size === allIds.length ? new Set() : new Set(allIds)
    );
  }, [data?.users]);

  return {
    data,
    isLoading,
    error,
    page,
    search,
    status,
    selectedUsers,
    approveModalUser,
    isPendingApproval: approveMutation.isPending,
    setPage,
    setSearch,
    setStatus,
    handleApprove,
    handleConfirmApproval,
    handleCloseApproveModal,
    handleDeny,
    handleToggleSelect,
    handleToggleSelectAll,
  };
}
