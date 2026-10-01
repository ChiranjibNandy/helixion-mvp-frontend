'use client';

import { useMemo, useState } from "react";
import {
  Mail,
  Check,
  Minus,
  KeyRound,
} from "lucide-react";

import SearchInput from "@/components/ui/search-input";
import Pagination from "@/components/ui/pagination";
import AppModal from "@/components/ui/app-modal";

import { useUsers } from "@/hooks/useUser";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { t } from "@/lib/i18n";
import { useDebounce } from "@/hooks/useDebounce";

import { AppAlert } from "@/components/shared/app-alert";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const [resetResult, setResetResult] = useState<{
    successful: string[];
    failed: {
      email: string;
      reason: string;
    }[];
  } | null>(null);

  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    loading,
    totalPages,
    error,
  } = useUsers(
    page,
    limit,
    debouncedSearch
  );

  const {
    sendResetLink,
    loading: loadingAction,
    error: resetLinkError,
  } = useForgotPassword();

  // --------------------------------------------------
  // SELECTED USER IDS
  // --------------------------------------------------

  const selectedUserIds = useMemo(
    () => new Set(
      selectedUsers.map((user) => user._id)
    ),
    [selectedUsers]
  );

  // --------------------------------------------------
  // SELECTION
  // --------------------------------------------------

  const isSelected = (user: any) => {
    return selectedUserIds.has(user._id);
  };

  const toggleUser = (user: any) => {
    setSelectedUsers((current) => {
      const exists = current.some(
        (selected) => selected._id === user._id
      );

      if (exists) {
        return current.filter(
          (selected) => selected._id !== user._id
        );
      }

      return [...current, user];
    });
  };

  // --------------------------------------------------
  // SELECT CURRENT PAGE
  // --------------------------------------------------

  const allCurrentPageSelected =
    data.length > 0 &&
    data.every((user: any) => selectedUserIds.has(user._id));

  const someCurrentPageSelected =
    data.some((user: any) => selectedUserIds.has(user._id));

  const toggleCurrentPage = () => {
    if (allCurrentPageSelected) {
      setSelectedUsers((current) =>
        current.filter(
          (selected) =>
            !data.some(
              (user: any) => user._id === selected._id
            )
        )
      );

      return;
    }

    setSelectedUsers((current) => {
      const existingIds = new Set(
        current.map((user) => user._id)
      );

      const newUsers = data.filter(
        (user: any) => !existingIds.has(user._id)
      );

      return [...current, ...newUsers];
    });
  };

  // --------------------------------------------------
  // OPEN CONFIRM MODAL
  // --------------------------------------------------

  const openConfirmModal = () => {
    if (selectedUsers.length === 0) return;

    setConfirmOpen(true);
  };

  // --------------------------------------------------
  // CLOSE CONFIRM MODAL
  // --------------------------------------------------

  const closeConfirmModal = () => {
    if (loadingAction) return;

    setConfirmOpen(false);
  };

  // --------------------------------------------------
  // SEND RESET LINKS
  // --------------------------------------------------

  const handleSendResetLink = async () => {
    if (selectedUsers.length === 0) return;

    const emails = selectedUsers
      .map((user) => user.email)
      .filter(Boolean);

    if (emails.length === 0) return;

    const result = await sendResetLink(emails);

    if (!result) return;

    setResetResult(result);

    setConfirmOpen(false);
    setSuccessOpen(true);

    setSelectedUsers([]);
  };

  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [
    {
      key: "select",
      header: (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleCurrentPage();
          }}
          className="
            flex
            size-5
            items-center
            justify-center
            rounded
            border
            border-borderCard
            bg-transparent
            transition-colors
            hover:border-emerald-400
          "
          aria-label={
            allCurrentPageSelected
              ? "Deselect all users on this page"
              : "Select all users on this page"
          }
        >
          {allCurrentPageSelected ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : someCurrentPageSelected ? (
            <Minus className="size-3.5 text-emerald-400" />
          ) : null}
        </button>
      ),
      className: "w-12",
      render: (row: any) => {
        const selected = isSelected(row);

        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleUser(row);
            }}
            className={`
              flex
              size-5
              items-center
              justify-center
              rounded
              border
              transition-all
              ${selected
                ? "border-emerald-400 bg-emerald-400"
                : "border-borderCard bg-transparent hover:border-emerald-400"
              }
            `}
            aria-label={
              selected
                ? `Deselect ${row.username}`
                : `Select ${row.username}`
            }
          >
            {selected && (
              <Check className="size-3.5 text-black" />
            )}
          </button>
        );
      },
    },

    {
      key: "username",
      header: t("table.username"),
      render: (row: any) => (
        <span className="font-medium">
          {row.username}
        </span>
      ),
    },

    {
      key: "email",
      header: t("table.email"),
      render: (row: any) => row.email,
    },

    {
      key: "action",
      header: t("table.action"),
      className: "w-24",
      render: (row: any) => {
        const selected = isSelected(row);

        return (
          <div className="flex items-center justify-center">
            <KeyRound
              className={`
            size-5
            transition-all
            duration-200
            ${selected
                  ? "text-emerald-400"
                  : "text-textSidebarMuted/40"
                }
          `}
              aria-label={
                selected
                  ? "Selected for password reset"
                  : "Password reset available"
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-6">

      {/* SEARCH */}
      <SearchInput
        value={search}
        onChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder={t("input.searchPlaceholder")}
      />

      {/* SELECTION TOOLBAR */}
      {selectedUsers.length > 0 && (
        <div
          className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            border-borderCard
            bg-bgStatCard
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                size-7
                items-center
                justify-center
                rounded-full
                bg-emerald-400/10
                text-sm
                font-semibold
                text-emerald-400
              "
            >
              {selectedUsers.length}
            </div>

            <span className="text-sm text-textSidebarMuted">
              {selectedUsers.length === 1
                ? "user selected"
                : "users selected"}
            </span>
          </div>

          <Button
            onClick={openConfirmModal}
            disabled={loadingAction}
            className="gap-2"
          >
            <KeyRound className="size-4" />
            Reset Password
          </Button>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <AppAlert
          variant="destructive"
          title="Error"
          description={error}
          className="items-center justify-center"
        />
      ) : (
        <DataTable
          data={data}
          columns={columns}
          rowKey={(row: any) => row._id}
          onRowClick={toggleUser}
          rowClassName={(row: any) => {
            if (isSelected(row)) {
              return `
                bg-emerald-400/10
                hover:bg-emerald-400/15
                cursor-pointer
              `;
            }

            return "cursor-pointer";
          }}
        />
      )}

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* CONFIRM MODAL */}
      <AppModal
        isOpen={confirmOpen}
        type="confirm"
        title="Reset Password"
        description={
          selectedUsers.length === 1
            ? `Send a password reset link to ${selectedUsers[0]?.email}?`
            : `Send password reset links to ${selectedUsers.length} selected users?`
        }
        confirmLabel="Send Reset Links"
        cancelLabel={t("button.cancel")}
        loading={loadingAction}
        error={resetLinkError}
        onConfirm={handleSendResetLink}
        onCancel={closeConfirmModal}
      />

      {/* SUCCESS / RESULT MODAL */}
      <AppModal
        isOpen={successOpen}
        type={
          resetResult?.failed.length
            ? "confirm"
            : "success"
        }
        title={
          resetResult?.failed.length
            ? "Reset Links Processed"
            : "Links Sent"
        }
        description={
          resetResult
            ? resetResult.failed.length === 0
              ? `Password reset links were successfully sent to ${resetResult.successful.length} ${resetResult.successful.length === 1
                ? "user"
                : "users"
              }.`
              : `Password reset links were sent to ${resetResult.successful.length} users, but ${resetResult.failed.length} ${resetResult.failed.length === 1
                ? "user could not"
                : "users could not"
              } be processed.`
            : ""
        }
        doneLabel={t("button.done")}
        onDone={() => {
          setSuccessOpen(false);
          setResetResult(null);
        }}
      />
    </div>
  );
}