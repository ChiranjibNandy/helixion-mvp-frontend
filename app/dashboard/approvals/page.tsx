'use client';

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import ApprovalExpandedRow from "@/components/dashboard/approvals/ApprovalExpandedRow";
import ApprovalStatusBadge from "@/components/shared/ApprovalStatusBadge";
import DataTable from "@/components/shared/data-table";
import PaginationController from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";

import { useEnrollmentApprovals } from "@/hooks/useEnrollmentApprovals";
import { formatDate } from "@/utils/formatters";
import { AppAlert } from "@/components/shared/app-alert";

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
  } = useEnrollmentApprovals();

  const [expanded, setExpanded] = useState<string | null>(null);

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

  const columns = [
    {
      header: "Employee",
      render: (row: any) => (
        <div className="font-medium">
          {row.employeeId?.name}
        </div>
      ),
    },
    {
      header: "Program",
      render: (row: any) => row.programSnapshot?.title,
    },
    {
      header: "From",
      render: (row: any) => formatDate(row.programSnapshot?.startDate),
    },
    {
      header: "To",
      render: (row: any) => formatDate(row.programSnapshot?.endDate),
    },
    {
      header: "Venue",
      render: (row: any) => row.programSnapshot?.venue,
    },
    {
      header: "Status",
      render: (row: any) => (
        <ApprovalStatusBadge status={row.status} />
      ),
    },
    {
      header: "",
      className: "w-10",
      render: (row: any) =>
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
          Review pending enrollment requests.
        </p>
      </div>

      <SearchInput
        value={searchInput}
        onChange={(value) => setSearchInput(value)}
        placeholder="Search employee or program..."
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
        rowKey={(row) => row._id}
        onRowClick={(row) =>
          setExpanded(expanded === row._id ? null : row._id)
        }
        isRowExpanded={(row) => expanded === row._id}
        renderExpandedRow={(row) => (
          <ApprovalExpandedRow row={row} />
        )}
      />

      <PaginationController
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}