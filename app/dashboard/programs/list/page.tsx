"use client";

import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrograms } from "@/hooks/UseProgramReturn";
import DataTable from "@/components/shared/data-table";
import PaginationController from "@/components/ui/pagination";
import { Program } from "@/types/program";
import { ROUTES } from "@/constants/navigation";
import { t } from "@/lib/i18n";

export default function ProgramsPage() {
   const router = useRouter();

   const {
      programs,
      loading,
      error,
      pagination,
      search,
      setSearch,
      setPage,
   } = usePrograms();

   const columns = [
      {
         key: "title",
         header: t("programme.title"),
         render: (program: Program) => (
            <span className="font-medium text-sm">
               {program.title}
            </span>
         ),
      },

      {
         key: "startDate",
         header: t("programme.date"),
         render: (program: Program) => (
            <span className="text-xs text-textSidebarMuted">
               {new Date(program.startDate).toLocaleDateString(
                  "en-GB",
                  {
                     day: "2-digit",
                     month: "short",
                     year: "numeric",
                  }
               )}
            </span>
         ),
      },

      {
         key: "enrolledCount",
         header: t("programme.list.enrolledLabel"),
         render: (program: Program) => (
            <span className="text-sm font-medium">
               {program.enrolledCount} / {program.maxParticipants}
            </span>
         ),
      },

      {
         key: "fillRate",
         header: t("providerDashboard.livePrograms.columns.fill"),
         render: (program: Program) => (
            <div className="w-16">
               <div className="h-1.5 w-full rounded-full bg-bgStatCard overflow-hidden">
                  <div
                     className="h-full rounded-full bg-primary transition-all"
                     style={{
                        width: `${ Math.min(program.fillRate, 100) }%`,
                     }}
                  />
               </div>
            </div>
         ),
      },
   ];

   return (
      <div className="flex flex-col gap-5">

         {/* Header */}
         <div className="flex items-center justify-between">

            <div>
               <h1 className="text-lg font-semibold">
                  {t("programme.list.title")}
               </h1>

               <p className="text-xs text-textSidebarMuted mt-1">
                  {t("table.listedSubtitle")}
               </p>
            </div>

            <div className="flex items-center gap-3">

               {/* Search */}
               <div className="relative w-64">
                  <Search
                     size={15}
                     className="absolute left-3 top-1/2 -translate-y-1/2 text-textSidebarMuted"
                  />

                  <Input
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder={t("programme.list.searchPlaceholder")}
                     className="pl-9 h-9 text-sm"
                  />
               </div>

               {/* Add Enrollment */}
               <Button
                  onClick={() => router.push(ROUTES.PROVIDER.PROGRAMS.CREATE)}
                  className="h-9"
               >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("add.enroll")}
               </Button>
            </div>
         </div>

         {/* Error */}
         {error && (
            <p className="text-sm text-red-500">
               {error}
            </p>
         )}

         {/* Table */}
         <div className="rounded-lg border border-borderCard overflow-hidden">

            <DataTable
               data={programs}
               columns={columns}
               loading={loading}
               emptyMessage={
                  search
                     ? t("programme.noprogramsfoundsearch")
                     : t("programme.noprogramsAvailable")
               }
               rowKey={(program: Program) => program._id}
               className="rounded-lg"
            />

         </div>

         {/* Pagination */}
         {pagination && pagination.totalPages >= 1 && (
            <PaginationController
               page={pagination.page}
               totalPages={pagination.totalPages}
               onPageChange={setPage}
            />
         )}

      </div>
   );
}