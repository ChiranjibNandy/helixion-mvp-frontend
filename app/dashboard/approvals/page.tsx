'use client';

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import ApprovalExpandedRow from "@/components/dashboard/approvals/ApprovalExpandedRow";
import ConfirmApprovalModal from "@/components/dashboard/approvals/ConfirmApprovalModal";
import ApprovalStatusBadge from "@/components/shared/ApprovalStatusBadge";
import DataTable from "@/components/shared/data-table";
import PaginationController from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";

import { useEnrollmentApprovals } from "@/hooks/useEnrollmentApprovals";
import { formatDate } from "@/utils/formatters";
import { AppAlert } from "@/components/shared/app-alert";
import { EnrollmentApproval } from "@/types/enrollment";
import { takeEnrollmentActionAPI } from "@/services/enrollmentApprovalService";

const MANAGER_ACTION_TO_STATUS: Record<string, string> = {
  approve: "approved",
  reject: "rejected",
  recommend: "pending",
  pending: "pending",
};

export default function Page() {
  const {
    data,
    loading,
    error,
    page,
    totalPages,
    setPage,
    search,
    setSearch,
    refresh,
  } = useEnrollmentApprovals();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionRow, setActionRow] = useState<EnrollmentApproval | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Local state for debounce
  const [searchInput, setSearchInput] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setPage(1);
        setSearch(searchInput);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, search, setSearch, setPage]);

  const closeModal = () => {
    if (actionLoading) return;
    setActionRow(null);
    setActionError(null);
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (!actionRow) return;

    setActionLoading(true);
    setActionError(null);

    try {
      await takeEnrollmentActionAPI(actionRow._id, action);
      setActionRow(null);
      refresh();
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message || err?.message || "Something went wrong"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: "Employee Name",
      render: (row: EnrollmentApproval) => (
        <div className="font-medium">
          {row.employeeId?.name}
        </div>
      ),
    },
    {
      header: "Program Title",
      render: (row: EnrollmentApproval) => row.programId?.title,
    },
    {
      header: "From Date",
      render: (row: EnrollmentApproval) => formatDate(row.programId?.startDate),
    },
    {
      header: "To Date",
      render: (row: EnrollmentApproval) => formatDate(row.programId?.endDate),
    },
    {
      header: "Venue/City",
      render: (row: EnrollmentApproval) => row.programId?.venueName || row.programId?.city,
    },
    {
      header: "Status",
      render: (row: EnrollmentApproval) => (
        <ApprovalStatusBadge
          status={MANAGER_ACTION_TO_STATUS[row.managerApproval?.action] || "pending"}
        />
      ),
    },
    {
      header: "",
      className: "w-10",
      render: (row: EnrollmentApproval) =>
        expanded === row._id ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Approve Training Programs
        </h1>

        <p className="text-gray-400 text-sm">
          Review and action pending enrollment requests from your team
        </p>
      </div>

      <SearchInput
        value={searchInput}
        onChange={(value) => setSearchInput(value)}
        placeholder="Search by employee or program..."
        className="max-w-sm"
      />

      {error && (
        <div className="mb-4">
          <AppAlert
            variant="destructive"
            title="Error"
            description={error}
          />
        </div>
      )}

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        rowKey={(row: EnrollmentApproval) => row._id}
        onRowClick={(row: EnrollmentApproval) =>
          setExpanded(expanded === row._id ? null : row._id)
        }
        isRowExpanded={(row: EnrollmentApproval) => expanded === row._id}
        renderExpandedRow={(row: EnrollmentApproval) => (
          <ApprovalExpandedRow row={row} onActionClick={setActionRow} />
        )}
      />

      <PaginationController
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmApprovalModal
        isOpen={Boolean(actionRow)}
        row={actionRow}
        loading={actionLoading}
        error={actionError}
        onApprove={() => handleAction("approve")}
        onReject={() => handleAction("reject")}
        onCancel={closeModal}
      />
    </div>
  );
}
