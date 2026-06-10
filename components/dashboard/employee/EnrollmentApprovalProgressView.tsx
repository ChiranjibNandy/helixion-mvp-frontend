"use client";

import React, { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Info, ChevronRight } from "lucide-react";
import { getEmployeeEnrollments } from "@/services/employeeService";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDateHyphenated } from "@/utils/formatters";
import DataTable from "@/components/shared/data-table";
import { Spinner } from "@/components/ui/spinner";
import { EnrollmentStepsTracker, ENROLLMENT_STAGE } from "./EnrollmentStepsTracker";

export default function EnrollmentApprovalProgressView() {
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                setLoading(true);
                const data = await getEmployeeEnrollments();
                setEnrollments(data);
                if (data && data.length > 0) {
                    setSelectedEnrollmentId(data[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch enrollments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    const selectedEnrollment = enrollments.find(e => e._id === selectedEnrollmentId) || enrollments[0];

    const getProgramDetails = (enrollment: any) => {
        if (!enrollment) return {};
        const p = enrollment.programId;
        return typeof p === 'object' && p ? p : (enrollment.programDetails || {});
    };

    const getStatusMessage = (enrollment: any) => {
        const stage = enrollment.currentStage;
        if (stage === ENROLLMENT_STAGE.SUBMITTED) {
            return t("approvalProgress.statusMessages.submitted");
        }
        if (stage === ENROLLMENT_STAGE.MANAGER_REVIEW) {
            return t("approvalProgress.statusMessages.managerReview");
        }
        if (stage === ENROLLMENT_STAGE.TRAINING_DEPT_APPROVAL || stage === ENROLLMENT_STAGE.OSD_REVIEW) {
            return t("approvalProgress.statusMessages.hrReview");
        }
        if (stage === ENROLLMENT_STAGE.ATTENDANCE) {
            return t("approvalProgress.statusMessages.attendance");
        }
        if (stage === ENROLLMENT_STAGE.REIMBURSEMENT) {
            return t("approvalProgress.statusMessages.reimbursement");
        }
        if (stage === ENROLLMENT_STAGE.CREDITED) {
            return t("approvalProgress.statusMessages.credited");
        }
        return t("approvalProgress.statusMessages.default");
    };

    const getBadgeStatus = (status: string) => {
        if (status === "pending") return "pending";
        if (status === "active") return "in_progress";
        if (status === "completed") return "completed";
        return "pending";
    };

    const getBadgeLabel = (status: string) => {
        if (status === "pending") return "Pending";
        if (status === "active") return "In Progress";
        if (status === "completed") return "Completed";
        return status;
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
            selectedEnrollmentId === enrollment._id ? "bg-white/5 border-l-2 border-l-primary" : ""
        );
    };

    const columns = [
        {
            key: "no",
            header: t("approvalProgress.enrolledPrograms.columns.no"),
            className: "text-sm text-textSidebarMuted py-4 w-16",
            render: (_: any, index?: number) => `${(index ?? 0) + 1}.`,
        },
        {
            key: "title",
            header: t("approvalProgress.enrolledPrograms.columns.title"),
            className: "text-sm text-white font-medium py-4 max-w-xs",
            render: (enrollment: any) => getProgramDetails(enrollment)?.title || "Unknown",
        },
        {
            key: "fromDate",
            header: t("approvalProgress.enrolledPrograms.columns.fromDate"),
            className: "text-sm text-textSidebarMuted py-4",
            render: (enrollment: any) => formatDateHyphenated(getProgramDetails(enrollment)?.startDate),
        },
        {
            key: "toDate",
            header: t("approvalProgress.enrolledPrograms.columns.toDate"),
            className: "text-sm text-textSidebarMuted py-4",
            render: (enrollment: any) => formatDateHyphenated(getProgramDetails(enrollment)?.endDate),
        },
        {
            key: "venueCity",
            header: t("approvalProgress.enrolledPrograms.columns.venueCity"),
            className: "text-sm text-textSidebarMuted py-4",
            render: (enrollment: any) => {
                const prog = getProgramDetails(enrollment);
                return prog?.city || prog?.venue || "N/A";
            },
        },
        {
            key: "status",
            header: t("approvalProgress.enrolledPrograms.columns.status"),
            className: "py-4",
            render: (enrollment: any) => (
                <Badge status={getBadgeStatus(enrollment.status) as any} className="capitalize px-3 py-1">
                    {getBadgeLabel(enrollment.status)}
                </Badge>
            ),
        },
        {
            key: "chevron",
            header: "",
            className: "w-10 py-4",
            render: () => <ChevronRight className="size-4 text-textSidebarMuted" />,
        },
    ];

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
                        You have not enrolled in any training programs yet.
                    </p>
                    <Link 
                        href="/dashboard"
                        className="inline-block px-5 py-2.5 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary/90 transition-all duration-200"
                    >
                        Browse programs to enroll
                    </Link>
                </Card>
            ) : (
                <Card className="bg-bgStatCard border-borderCard p-8">
                    <div className="space-y-12">
                        {/* Selected Program Title */}
                        <div className="border-b border-white/5 pb-4">
                            <span className="text-[10px] uppercase tracking-wider text-textSidebarMuted font-bold block mb-1">
                                Currently Tracking
                            </span>
                            <h2 className="text-xl font-bold text-white">
                                {getProgramDetails(selectedEnrollment)?.title || "Unknown Program"}
                            </h2>
                        </div>

                        {/* Progress Tracker */}
                        {selectedEnrollment && <EnrollmentStepsTracker enrollment={selectedEnrollment} />}

                        {/* Dynamic Info Message */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-white">
                            <div className="bg-primary/20 p-2 rounded-full flex-shrink-0">
                                <Info className="size-5 text-primary" />
                            </div>
                            <p className="text-sm">
                                {selectedEnrollment ? getStatusMessage(selectedEnrollment) : t("approvalProgress.statusMessage")}
                            </p>
                        </div>

                        {/* Enrolled Programs Table */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                {t("approvalProgress.enrolledPrograms.title")}
                                <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs text-textSidebarMuted font-normal">
                                    {enrollments.length}
                                </span>
                            </h2>
                            <div className="rounded-xl border border-borderCard overflow-hidden">
                                <DataTable
                                    columns={columns}
                                    data={enrollments}
                                    onRowClick={(enrollment) => setSelectedEnrollmentId(enrollment._id)}
                                    rowClassName={getRowClassName}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
