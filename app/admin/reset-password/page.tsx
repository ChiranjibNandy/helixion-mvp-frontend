'use client';

import { useState } from "react";
import { Share2 } from "lucide-react";

import SearchInput from "@/components/ui/search-input";
import Pagination from "@/components/ui/pagination";
import DataTable from "@/components/shared/data-table";
import AppModal from "@/components/ui/app-modal";

import { useUsers } from "@/hooks/useUser";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { t } from "@/lib/i18n";
import { useDebounce } from "@/hooks/useDebounce";
import { AppAlert } from "@/components/shared/app-alert";
import { Spinner } from "@/components/ui/spinner";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  const { data, loading, totalPages, error } = useUsers(page, limit, debouncedSearch);
  const { sendResetLink, loading: loadingAction } = useForgotPassword();

  // ----------------------------
  // OPEN CONFIRM MODAL
  // ----------------------------
  const openConfirmModal = (user: any) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  // ----------------------------
  // CLOSE CONFIRM MODAL
  // ----------------------------
  const closeConfirmModal = () => {
    setConfirmOpen(false);
    setSelectedUser(null);
  };

  // ----------------------------
  // SEND RESET LINK
  // ----------------------------
  const handleSendResetLink = async () => {
    if (!selectedUser?.email) return;

    const success = await sendResetLink(selectedUser.email);

    if (success) {
      setConfirmOpen(false);
      setSuccessOpen(true);
      setSelectedUser(null);
    }
  };

  // ----------------------------
  // TABLE COLUMNS
  // ----------------------------
  const columns = [
    {
      header: t("table.username"),
      render: (row: any) => row.username,
    },
    {
      header: t("table.email"),
      render: (row: any) => row.email,
    },
    {
      header: t("table.action"),
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => openConfirmModal(row)}
            className="p-2 rounded-md hover:bg-white/10 transition"
            title={t("auth.forgotPassword.submit")}
          >
            <Share2 size={18} className="text-green-500 hover:text-green-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">

      {/* SEARCH */}
      <SearchInput
        value={search}
        onChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder={t("input.searchPlaceholder")}
      />

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
        />
      ) : (
        <DataTable data={data} columns={columns} />
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
        title={t("auth.forgotPassword.confirmTitle")}
        description={
          selectedUser
            ? t("auth.resetPassword.confirmDescription", {
              email: selectedUser.email,
            })
            : "Send reset password link to this user"
        }
        confirmLabel={t("button.send")}
        cancelLabel={t('button.cancel')}
        loading={loadingAction}
        onConfirm={handleSendResetLink}
        onCancel={closeConfirmModal}
      />

      {/* SUCCESS MODAL */}
      <AppModal
        isOpen={successOpen}
        type="success"
        title="Link Sent"
        description={t("auth.resetPassword.successDescriptions")}
        doneLabel={t("button.done")}
        onDone={() => setSuccessOpen(false)}
      />
    </div>
  );
}