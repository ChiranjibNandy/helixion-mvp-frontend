"use client";

import React, { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { getEmployeeEnrollments } from "@/services/employeeService";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DataTable from "@/components/shared/data-table";
import { Spinner } from "@/components/ui/spinner";
import { EnrollmentStepsTracker } from "./EnrollmentStepsTracker";
import {
    createEnrollmentColumns,
    getProgramDetails,
} from "./enrolment/enrollmentApproval.constants";
import { TourSubmissionModal } from "./TourSubmissionModal";
import { getEnrollmentPanelByIdAPI } from "@/services/enrollmentApprovalService";
import SearchInput from "@/components/ui/search-input";
import PaginationController from "@/components/ui/pagination";

export default function EnrollmentApprovalProgressView() {
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTourModalOpen, setIsTourModalOpen] = useState(false);

    // States for row expansion & panel API data
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [panelDataMap, setPanelDataMap] = useState<Record<string, any>>({});
    const [loadingPanelId, setLoadingPanelId] = useState<string | null>(null);

    //pagination and search
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const fetchEnrollments = async () => {
        try {
            setLoading(true);

            const response = await getEmployeeEnrollments({
                page,
                limit,
                search,
            });

            setEnrollments(response.data || []);

            setTotal(response.pagination?.total || 0);
            setTotalPages(response.pagination?.totalPages || 1);

            if (response.data?.length > 0) {
                setSelectedEnrollmentId(response.data[0]._id);
            } else {
                setSelectedEnrollmentId(null);
            }
        } catch (err) {
            console.error("Failed to fetch enrollments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [search]);

    useEffect(() => {
        fetchEnrollments();
    }, [page, debouncedSearch]);

    //search 
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const selectedEnrollment =
        enrollments.find((e) => e._id === selectedEnrollmentId) || enrollments[0];

    // Handle clicking row to expand and trigger API fetch
    const handleRowClick = async (enrollment: any) => {
        const id = enrollment._id;
        setSelectedEnrollmentId(id);

        // Toggle collapse if clicking the same expanded row
        if (expandedRowId === id) {
            setExpandedRowId(null);
            return;
        }

        setExpandedRowId(id);

        // Fetch API panel data if not already cached
        if (!panelDataMap[id]) {
            try {
                setLoadingPanelId(id);
                const res = await getEnrollmentPanelByIdAPI(id)
                const panelData = res?.data || res;
                setPanelDataMap((prev) => ({ ...prev, [id]: panelData }));
            } catch (err) {
                console.error("Failed to fetch panel details:", err);
            } finally {
                setLoadingPanelId(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const getRowClassName = (enrollment: any) => {
        return cn(
            "border-borderCard hover:bg-white/5 cursor-pointer transition-all",
            selectedEnrollmentId === enrollment._id
                ? "bg-white/5 border-l-2 border-l-primary"
                : ""
        );
    };

    // Pass `expandedRowId` to update the icon state dynamically
    const columns = createEnrollmentColumns(t, expandedRowId);

    // Render content inside the expanded row
    const renderExpandedRow = (enrollment: any) => {
        const id = enrollment._id;
        const isLoading = loadingPanelId === id;
        const details = panelDataMap[id];

        return (
            <div className="p-5 bg-bgMain/60 border-t border-borderCard space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-textSidebarMuted text-sm">
                        <Spinner size="sm" />
                        <span>{t("common.loading")}</span>
                    </div>
                ) : details ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        {/* Stage */}
                        <div className="p-3 bg-bgStatCard rounded-lg border border-borderCard">
                            <span className="text-[10px] uppercase font-bold text-textSidebarMuted block mb-1">
                               {t("trainingEnrolment.currentStage")}
                            </span>
                            <p className="text-white font-medium capitalize">
                                {details.currentStage || "N/A"}
                            </p>
                        </div>

                        {/* Created By */}
                        <div className="p-3 bg-bgStatCard rounded-lg border border-borderCard">
                            <span className="text-[10px] uppercase font-bold text-textSidebarMuted block mb-1">
                                {t("trainingEnrolment.createdBy")}
                            </span>
                            {details.createdBy ? (
                                <div>
                                    <p className="text-white font-medium">{details.createdBy.name}</p>
                                    <p className="text-textSidebarMuted text-xs">{details.createdBy.email}</p>
                                </div>
                            ) : (
                                <p className="text-textSidebarMuted">{t("common.n/a")}</p>
                            )}
                        </div>

                        {/* Brochure */}
                        <div className="p-3 bg-bgStatCard rounded-lg border border-borderCard">
                            <span className="text-[10px] uppercase font-bold text-textSidebarMuted block mb-1">
                                {t("programme.fields.brochure")}
                            </span>
                            {details?.downloadBrochureUrl ? (
                                <a
                                    href={details.downloadBrochureUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-primary hover:underline text-xs font-semibold gap-1"
                                >
                                    {t("programme.list.downloadBrochure")}
                                </a>
                            ) : (
                                <p className="text-textSidebarMuted">{t("common.notAvailable")}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="p-3 bg-bgStatCard rounded-lg border border-borderCard md:col-span-2 lg:col-span-1">
                            <span className="text-[10px] uppercase font-bold text-textSidebarMuted block mb-1">
                                {t("programme.fields.notes")}
                            </span>
                            <p className="text-white text-xs">{details.notes || t("programme.fields.noNotesAvailable")}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-textSidebarMuted text-xs">{t("common.failedToLoad")}</p>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-8 pb-10 w-full">
            {/* Header Title without breadcrumbs */}
            <div className="flex flex-col gap-1 border-b border-borderCard pb-5">
                <h1 className="text-white text-3xl font-bold font-sans">
                    {t("approvalProgress.title")}
                </h1>
                <p className="text-textSidebarMuted text-sm">
                    {t("approvalProgress.subtitle")}
                </p>
            </div>

            {enrollments.length === 0 ? (
                <Card className="bg-bgStatCard border-borderCard p-8 text-center text-white space-y-4">
                    <p className="text-textSidebarMuted">
                        {t("approvalProgress.enrolledPrograms.notEnrollAnyProgram")}
                    </p>
                    <Link
                        href="/dashboard/programs"
                        className="inline-block px-5 py-2.5 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary/90 transition-all duration-200"
                    >
                        {t("approvalProgress.enrolledPrograms.browseprogramtoenroll")}
                    </Link>
                </Card>
            ) : (
                <Card className="bg-bgStatCard border-borderCard p-8">
                    <div className="space-y-12 p-3">
                        {/* Selected Program Title */}
                        <div className="border-b border-white/5 pb-4">
                            <span className="text-[10px] uppercase tracking-wider text-textSidebarMuted font-bold block mb-1">
                                {t("programme.currentlyTracking")}
                            </span>
                            <h2 className="text-xl font-bold text-white">
                                {getProgramDetails(selectedEnrollment)?.title || t("programme.unknownProgram")}
                            </h2>
                        </div>

                        {/* Progress Tracker */}
                        {selectedEnrollment && (
                            <EnrollmentStepsTracker enrollment={selectedEnrollment} />
                        )}

                        {/* Tour Submission CTA */}
                        {selectedEnrollment?.currentStage === "tour_pending_employee" && (
                            <div className="flex flex-col items-center justify-center p-6 mt-4 border border-borderCard rounded-xl bg-bgMain text-center space-y-4">
                                <h3 className="text-lg font-semibold text-white">
                                    {t("approvalProgress.enrolledPrograms.columns.tourFormRequired")}
                                </h3>
                                <p className="text-sm text-textSidebarMuted">
                                    {t("approvalProgress.statusMessages.submitTourDetails")}
                                </p>
                                <button
                                    onClick={() => setIsTourModalOpen(true)}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium"
                                >
                                    {t("button.submitTourDetails")}
                                </button>
                            </div>
                        )}

                        {/* Enrolled Programs Table */}
                        <div className="space-y-4">

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    {t("approvalProgress.enrolledPrograms.title")}

                                    <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs text-textSidebarMuted font-normal">
                                        {total}
                                    </span>
                                </h2>

                                <SearchInput
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder={t("programme.list.searchPlaceholder")}
                                    className="w-full md:w-64"
                                />

                            </div>

                            <div className="rounded-xl border border-borderCard overflow-hidden">
                                <DataTable
                                    columns={columns}
                                    data={enrollments}
                                    rowKey={(row) => row._id}
                                    onRowClick={handleRowClick}
                                    rowClassName={getRowClassName}
                                    isRowExpanded={(row) => expandedRowId === row._id}
                                    renderExpandedRow={renderExpandedRow}
                                    className="w-full"
                                />
                            </div>
                            {totalPages >= 1 && (
                                <PaginationController
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            )}

                        </div>
                    </div>
                </Card>
            )}

            {selectedEnrollment && (
                <TourSubmissionModal
                    enrollmentId={selectedEnrollment._id}
                    isOpen={isTourModalOpen}
                    onClose={() => setIsTourModalOpen(false)}
                    onSuccess={() => {
                        fetchEnrollments();
                    }}
                />
            )}
        </div>
    );
}