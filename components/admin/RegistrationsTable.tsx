"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/Pagination";
import { RegistrationsTableSkeleton } from "./RegistrationsTableSkeleton";
import { EmptyState } from "./EmptyState";
import { UserRow } from "./UserRow/UserRow";
import { ApproveModal } from "./ApproveModal";
import { useRegistrations } from "@/hooks/useRegistrations";
import { REGISTRATIONS_PAGE_LIMIT } from "@/config/pagination";
import styles from "./RegistrationsTable.module.css";

export function RegistrationsTable() {
  const {
    data,
    isLoading,
    error,
    page,
    search,
    selectedUsers,
    approveModalUser,
    setPage,
    setSearch,
    handleApprove,
    handleConfirmApproval,
    handleCloseApproveModal,
    handleDeny,
    handleToggleSelect,
    handleToggleSelectAll,
  } = useRegistrations();

  const totalPages = data ? Math.ceil(data.total / REGISTRATIONS_PAGE_LIMIT) : 0;
  const startIndex = data ? (page - 1) * REGISTRATIONS_PAGE_LIMIT + 1 : 0;
  const endIndex = data ? Math.min(page * REGISTRATIONS_PAGE_LIMIT, data.total) : 0;

  const isAllSelected =
    !!data?.users.length && selectedUsers.size === data.users.length;

  return (
    <div className={styles.container}>
      {/* Header  */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Pending registrations</h2>
          {data && data.total > 0 && (
            <Badge variant="secondary">{data.total} pending</Badge>
          )}
        </div>
        <Button variant="outline" disabled={selectedUsers.size === 0}>
          Bulk actions
        </Button>
      </div>

      {/* Search */}
      <div className={styles.searchSection}>
        <Input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label="Search pending registrations"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <RegistrationsTableSkeleton />
      ) : error ? (
        <div className={styles.error} role="alert">
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
                    <Checkbox
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      aria-label="Select all users on this page"
                    />
                  </th>
                  <th className={styles.nameHeader}>Name</th>
                  <th className={styles.emailHeader}>Email</th>
                  <th className={styles.dateHeader}>Registered</th>
                  <th className={styles.actionsHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    selected={selectedUsers.has(user.id)}
                    onToggleSelect={handleToggleSelect}
                    onApprove={handleApprove}
                    onDeny={handleDeny}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer  */}
          <div className={styles.footer}>
            <p className={styles.footerText} aria-live="polite">
              Showing {startIndex}–{endIndex} of {data.total} users
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              aria-label="Registrations table pagination"
            />
          </div>
        </>
      )}

      <ApproveModal
        user={approveModalUser}
        open={!!approveModalUser}
        onClose={handleCloseApproveModal}
        onConfirm={handleConfirmApproval}
      />
    </div>
  );
}
