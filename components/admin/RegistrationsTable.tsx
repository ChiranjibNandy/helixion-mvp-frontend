"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/Pagination";
import { RegistrationsTableSkeleton } from "./RegistrationsTableSkeleton";
import { EmptyState } from "./EmptyState";
import { UserRow } from "./UserRow/UserRow";
import { ApproveModal } from "./ApproveModal";
import { useRegistrations } from "@/hooks/useRegistrations";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { REGISTRATIONS_PAGE_LIMIT } from "@/config/pagination";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types/registration";

interface RegistrationsTableProps {
  initialStatus?: UserStatus | "all";
}

export function RegistrationsTable({ initialStatus = "all" }: RegistrationsTableProps) {
  const {
    data,
    isLoading,
    error,
    page,
    search,
    status,
    selectedUsers,
    approveModalUser,
    setPage,
    setSearch,
    setStatus,
    handleApprove,
    handleConfirmApproval,
    handleCloseApproveModal,
    handleDeny,
    handleToggleSelect,
    handleToggleSelectAll,
  } = useRegistrations(initialStatus);

  const { data: stats } = useDashboardStats();

  const tabs = [
    { id: "all", label: "All", count: stats?.totalUsers ?? 0 },
    { id: "pending", label: "Pending", count: stats?.pendingApproval ?? 0 },
    { id: "active", label: "Active", count: stats ? (stats.totalUsers - stats.pendingApproval - stats.deactivated) : 0 },
    { id: "denied", label: "Inactive", count: stats?.deactivated ?? 0 },
  ];

  const totalPages = data ? Math.ceil(data.total / REGISTRATIONS_PAGE_LIMIT) : 0;

  const isAllSelected =
    !!data?.users.length && selectedUsers.size === data.users.length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side Filter/Search */}
        <div className="flex items-center gap-4 w-full md:w-auto flex-1">
          <div className="relative w-full md:w-80">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.65 5.65z" />
            </svg>
            <Input
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full bg-inputBg border-borderDark h-9 w-full text-sm"
              aria-label="Search users"
            />
          </div>

          {/* Segmented Control Tabs */}
          <div className="hidden lg:flex items-center p-1 bg-bgCard border border-borderDark rounded-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatus(tab.id as UserStatus | "all")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-2",
                  status === tab.id
                    ? "bg-bgHover text-textPrimary shadow-sm"
                    : "text-textMuted hover:text-textSecondary"
                )}
              >
                {tab.label}
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full bg-bgMain border border-borderDark",
                  status === tab.id ? "text-textPrimary border-borderLight" : "text-textMuted"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0 0l-3-3m3 3l3-3M12 3v9" />
            </svg>
            Export CSV
          </Button>
          <Button className="h-9 gap-2">
            <span>+</span> Invite user
          </Button>
        </div>
      </div>

      {/* ── Main Data Table Container ────────────────────────────────────── */}
      <div className="bg-bgCard border border-borderDark rounded-xl overflow-hidden flex flex-col">
        {isLoading ? (
          <RegistrationsTableSkeleton />
        ) : error ? (
          <div className="p-8 text-center text-statusInactive" role="alert">
            Failed to load users. Please try again.
          </div>
        ) : !data || data.users.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-borderDark bg-bgMain/50">
                  <th className="px-6 py-4 w-12 text-sm font-semibold text-textMuted tracking-tight">
                    <Checkbox
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      aria-label="Select all users"
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider text-right">Actions</th>
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
        )}
        
        {/* Table Footer / Pagination */}
        {data && data.users.length > 0 && (
          <div className="px-6 py-4 border-t border-borderDark bg-bgMain/30 flex items-center justify-between">
            <p className="text-sm text-textMuted" aria-live="polite">
              Showing <span className="text-textPrimary font-medium">1</span> to <span className="text-textPrimary font-medium">{data.users.length}</span> of <span className="text-textPrimary font-medium">{data.total}</span> users
            </p>
            <Pagination
              page={page}
              totalPages={totalPages || 1}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ApproveModal
        user={approveModalUser}
        open={!!approveModalUser}
        onClose={handleCloseApproveModal}
        onConfirm={handleConfirmApproval}
      />
    </div>
  );
}
