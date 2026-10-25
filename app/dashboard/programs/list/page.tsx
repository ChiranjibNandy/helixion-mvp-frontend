"use client";

import { useRouter } from "next/navigation";
import { Search, Plus, Pencil, Receipt, MoreVertical, Copy, ClipboardCheck } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
            <div className="min-w-[220px] max-w-[320px]">
               <span
                  className="block truncate text-sm font-semibold text-textPrimary"
                  title={program.title}
               >
                  {program.title}
               </span>
            </div>
         ),
      },

      {
         key: "startDate",
         header: t("programme.date"),
         render: (program: Program) => (
            <span className="whitespace-nowrap text-sm text-textSidebarMuted">
               {new Date(program.startDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
               })}
            </span>
         ),
      },

      {
         key: "enrolledCount",
         header: t("programme.list.enrolledLabel"),
         render: (program: Program) => (
            <div className="flex items-center">
               <span className="rounded-md bg-bgStatCard px-2.5 py-1 text-sm font-semibold text-textPrimary">
                  {program.enrolledCount}
                  <span className="mx-1 text-textSidebarMuted">/</span>
                  <span className="text-textSidebarMuted">
                     {program.maxParticipants}
                  </span>
               </span>
            </div>
         ),
      },

      {
         key: "fillRate",
         header: t("providerDashboard.livePrograms.columns.fill"),
         render: (program: Program) => (
            <div className="flex w-24 flex-col gap-1.5">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-textPrimary">
                     {Math.round(program.fillRate)}%
                  </span>
               </div>

               <div className="h-1.5 w-full overflow-hidden rounded-full bg-bgStatCard">
                  <div
                     className="h-full rounded-full bg-primary transition-all duration-300"
                     style={{
                        width: `${ Math.min(program.fillRate, 100) }%`,
                     }}
                  />
               </div>
            </div>
         ),
      },

      {
         key: "confirmedEnrollmentCount",
         header: t("programme.list.confirmedLabel"),
         render: (program: Program) => (
            <div className="flex items-center">
               <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                  {program.confirmedEnrollmentCount ?? 0}
                  <span className="mx-1 opacity-50">/</span>
                  <span className="opacity-70">
                     {program.maxParticipants}
                  </span>
               </span>
            </div>
         ),
      },

      {
         key: "actions",
         header: "",
         render: (program: Program) => {
            const hasEnded = !!program.endDate && new Date(program.endDate) < new Date();
            return (
               <div className="flex items-center justify-end gap-1">
                  <DropdownMenu>
                     <DropdownMenuTrigger
                        className={cn(
                           buttonVariants({ variant: "ghost", size: "icon" }),
                           "h-8 w-8 rounded-md text-textSidebarMuted hover:bg-bgButton hover:text-white"
                        )}
                        title="More actions"
                     >
                        <MoreVertical size={15} />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="min-w-40 bg-[#1a1b25] border border-white/10 text-white">
                        <DropdownMenuItem
                           onClick={() => router.push(`/dashboard/update-attendance/${program._id}`)}
                           className="text-white whitespace-nowrap focus:bg-bgButton focus:text-white"
                        >
                           <ClipboardCheck size={14} className="mr-2" />
                           Attendance
                        </DropdownMenuItem>
                        {hasEnded && (
                           <DropdownMenuItem
                              onClick={() => window.open(`/dashboard/programs/invoices/${program._id}`, "_blank")}
                              className="text-white whitespace-nowrap focus:bg-bgButton focus:text-white"
                           >
                              <Receipt size={14} className="mr-2" />
                              {t("providerDashboard.invoices.action")}
                           </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                           onClick={() =>
                              router.push(
                                 `${ ROUTES.PROVIDER.PROGRAMS.CREATE }?duplicateFrom=${ program._id }`
                              )
                           }
                           className="text-white whitespace-nowrap focus:bg-bgButton focus:text-white"
                        >
                           <Copy size={14} className="mr-2" />
                           {t('programme.list.duplicateButton')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           onClick={() =>
                              router.push(
                                 `/dashboard/programs/edit-published/${ program._id }`
                              )
                           }
                           className="text-white whitespace-nowrap focus:bg-bgButton focus:text-white"
                        >
                           <Pencil size={14} className="mr-2" />
                           Edit Program
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            );
         },
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