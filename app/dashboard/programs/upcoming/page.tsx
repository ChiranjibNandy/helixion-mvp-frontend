
"use client";

import { useCallback, useEffect, useState } from "react";

import { DashboardSectionCard } from "@/components/shared/dashboard-section-card";
import { Pagination } from "@/types/pagination";
import { DashboardUpcomingProgram, providerService } from "@/services/provider.service";
import { UpcomingProgramsTable } from "@/components/dashboard/trainingDept/UpcomingProgramsTable";
import PaginationController from "@/components/ui/pagination";
import { t } from "@/lib/i18n";
import { Spinner } from "@/components/ui/spinner";



const PAGE_LIMIT = 10;

const initialPagination: Pagination = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 0,
};

export default function UpcomingProgramsList() {
  const [programs, setPrograms] = useState<DashboardUpcomingProgram[]>([]);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await providerService.getDashboardData(
        currentPage,
        PAGE_LIMIT
      );

      setPrograms(response.upcomingPrograms.programs);
      setPagination(response.upcomingPrograms.pagination);
    } catch (err) {
      console.error("Failed to fetch upcoming programs:", err);
      setError("Unable to load upcoming programs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms(page);
  }, [page, fetchPrograms]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <DashboardSectionCard
      title={
        <div>
          <h2 className="text-white text-lg font-semibold">
            {t("upcomingPrograms.upcomingtrainingprograms")}
          </h2>

          <p className="text-textSidebarMuted text-xs mt-1">
            {t("upcomingPrograms.allupcomingprograms")}
          </p>
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-10 text-center text-red-500">
          {error}
          <button
            onClick={() => fetchPrograms(page)}
            className="ml-2 underline"
          >
            {t("common.retry")}
          </button>
        </div>
      ) : (
        <>
          <UpcomingProgramsTable programs={programs} />

          {pagination.totalPages > 1 && (
            <div className="mt-5">
              <p className="mb-3 text-sm text-textSidebarMuted text-center">
                Showing {programs.length} of {pagination.total} programs
              </p>

              <PaginationController
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </DashboardSectionCard>
  );
}