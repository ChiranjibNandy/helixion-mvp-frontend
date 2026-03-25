"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Role, PaginatedResponse } from "@/types/registration";
import { getRegistrations, approveUser } from "@/lib/api/registrations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonTable } from "./SkeletonTable";
import { EmptyState } from "./EmptyState";
import { UserRow } from "./UserRow";
import { ApproveModal } from "./ApproveModal";
import styles from "./RegistrationsTable.module.css";

export function RegistrationsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [approveModalUser, setApproveModalUser] = useState<User | null>(null);
  const limit = 10;

  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["registrations", page, debouncedSearch],
    queryFn: () => getRegistrations(page, limit, debouncedSearch || undefined),
  });

  const approveMutation = useMutation({
    mutationFn: ({ userId, role, note }: { userId: string; role: Role; note?: string }) =>
      approveUser(userId, { role, note }),
    onMutate: async ({ userId }: { userId: string; role: Role; note?: string }) => {
      await queryClient.cancelQueries({ queryKey: ["registrations"] });

      const previousData = queryClient.getQueryData(["registrations", page, debouncedSearch]);

      queryClient.setQueryData(
        ["registrations", page, debouncedSearch],
        (old: PaginatedResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            users: old.users.filter((u: User) => u.id !== userId),
            total: old.total - 1,
          };
        }
      );

      return { previousData };
    },
    onError: (_err: Error, _variables: { userId: string; role: Role; note?: string }, context?: { previousData: PaginatedResponse | undefined }) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["registrations", page, debouncedSearch],
          context.previousData
        );
      }
      alert("Failed to approve user. Please try again.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });

  const handleApprove = useCallback((user: User) => {
    setApproveModalUser(user);
  }, []);

  const handleConfirmApproval = useCallback(
    (role: Role, note?: string) => {
      if (approveModalUser) {
        approveMutation.mutate({
          userId: approveModalUser.id,
          role,
          note,
        });
        setApproveModalUser(null);
      }
    },
    [approveModalUser, approveMutation]
  );

  const handleDeny = useCallback((userId: string) => {
    if (confirm("Are you sure you want to deny this registration?")) {
      console.log("Deny user:", userId);
    }
  }, []);

  const handleToggleSelect = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    if (!data?.users) return;
    
    if (selectedUsers.size === data.users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(data.users.map((u: User) => u.id)));
    }
  }, [data?.users, selectedUsers.size]);

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const startIndex = data ? (page - 1) * limit + 1 : 0;
  const endIndex = data ? Math.min(page * limit, data.total) : 0;

  const renderPagination = () => {
    if (!data || totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return (
      <div className={styles.pagination}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className={styles.pageNumbers}>
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`${styles.pageButton} ${
                  page === p ? styles.pageButtonActive : ""
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Pending registrations</h2>
          {data && data.total > 0 && (
            <Badge variant="secondary">
              {data.total} pending
            </Badge>
          )}
        </div>
        <Button variant="outline" disabled={selectedUsers.size === 0}>
          Bulk actions
        </Button>
      </div>

      <div className={styles.searchSection}>
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : error ? (
        <div className={styles.error}>
          Failed to load registrations. Please try again.
        </div>
      ) : !data || data.users.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.checkboxHeader}>
                    <input
                      type="checkbox"
                      checked={
                        data.users.length > 0 &&
                        selectedUsers.size === data.users.length
                      }
                      onChange={handleToggleSelectAll}
                      className={styles.checkbox}
                    />
                  </th>
                  <th className={styles.nameHeader}>Name</th>
                  <th className={styles.emailHeader}>Email</th>
                  <th className={styles.dateHeader}>Registered</th>
                  <th className={styles.actionsHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user: User) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    selected={selectedUsers.has(user.id)}
                    onToggleSelect={() => handleToggleSelect(user.id)}
                    onApprove={() => handleApprove(user)}
                    onDeny={() => handleDeny(user.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Showing {startIndex} to {endIndex} of {data.total} users
            </p>
            {renderPagination()}
          </div>
        </>
      )}

      <ApproveModal
        user={approveModalUser}
        open={!!approveModalUser}
        onClose={() => setApproveModalUser(null)}
        onConfirm={handleConfirmApproval}
      />
    </div>
  );
}
