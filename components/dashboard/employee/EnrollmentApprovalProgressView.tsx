"use client";

import React, { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import EnrollmentProgressTracker from "@/components/ui/EnrollmentProgressTracker";
import { Info, FileText, UserCheck, ClipboardList, Banknote, Building2, ChevronRight, Loader2 } from "lucide-react";
import { getEmployeeEnrollments } from "@/services/employeeService";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EnrollmentApprovalProgressView() {
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
    };

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

    const getStepsForEnrollment = (enrollment: any) => {
        const timeline = enrollment.timeline || [];
        
        const getTimelineDate = (stage: string, action?: string) => {
            const log = timeline.find((t: any) => {
                if (action) {
                    return t.stage === stage && t.action === action;
                }
                return t.stage === stage;
            });
            return log ? formatDate(log.at) : undefined;
        };

        const stage = enrollment.currentStage;

        // Step 1: Application Submitted
        const step1Status: "completed" | "current" | "upcoming" = stage === "submitted" ? "current" : "completed";
        const step1Date = getTimelineDate("submitted") || formatDate(enrollment.createdAt);

        // Step 2: Approved by Reporting Manager
        let step2Status: "completed" | "current" | "upcoming" = "upcoming";
        if (enrollment.managerApproval?.action === "approved") {
            step2Status = "completed";
        } else if (stage === "manager_review") {
            step2Status = "current";
        }
        const step2Date = getTimelineDate("manager_review", "approved") || 
            (enrollment.managerApproval?.actedAt ? formatDate(enrollment.managerApproval.actedAt) : undefined);

        // Step 3: HR / Training Department Review
        let step3Status: "completed" | "current" | "upcoming" = "upcoming";
        if (stage === "attendance" || stage === "reimbursement" || stage === "credited") {
            step3Status = "completed";
        } else if (stage === "training_dept_approval" || stage === "osd_review") {
            step3Status = "current";
        }
        const step3Date = getTimelineDate("training_dept_approval", "approved") || getTimelineDate("osd_review", "approved");

        // Step 4: Reimbursement Submitted
        let step4Status: "completed" | "current" | "upcoming" = "upcoming";
        if (stage === "credited") {
            step4Status = "completed";
        } else if (stage === "reimbursement") {
            step4Status = "current";
        }
        const step4Date = getTimelineDate("reimbursement", "submitted");

        // Step 5: Reimbursement Credited
        const step5Status: "completed" | "current" | "upcoming" = stage === "credited" ? "completed" : "upcoming";
        const step5Date = getTimelineDate("credited");

        return [
            {
                id: "1",
                label: t("approvalProgress.steps.submitted"),
                date: step1Date,
                status: step1Status,
                icon: FileText,
            },
            {
                id: "2",
                label: t("approvalProgress.steps.manager"),
                date: step2Date,
                status: step2Status,
                icon: UserCheck,
            },
            {
                id: "3",
                label: t("approvalProgress.steps.hrReview"),
                date: step3Date,
                status: step3Status,
                icon: ClipboardList,
            },
            {
                id: "4",
                label: t("approvalProgress.steps.reimbursementSubmitted"),
                date: step4Date,
                status: step4Status,
                icon: Banknote,
            },
            {
                id: "5",
                label: t("approvalProgress.steps.credited"),
                date: step5Date,
                status: step5Status,
                icon: Building2,
            },
        ];
    };

    const getStatusMessage = (enrollment: any) => {
        const stage = enrollment.currentStage;
        if (stage === "submitted") {
            return "Your enrollment request has been initialized. Please complete travel and stay details to submit for review.";
        }
        if (stage === "manager_review") {
            return "Your application has been submitted and is currently awaiting approval from your Reporting Manager.";
        }
        if (stage === "training_dept_approval" || stage === "osd_review") {
            return "Your application has been approved by your manager and is currently under HR / Training Department review.";
        }
        if (stage === "attendance") {
            return "Your attendance for the training has been recorded! You can now submit your reimbursement claim.";
        }
        if (stage === "reimbursement") {
            return "Your reimbursement claim has been submitted and is under financial audit/review.";
        }
        if (stage === "credited") {
            return "Congratulations! Your reimbursement has been approved and successfully credited to your bank account.";
        }
        return "Track the status of your training program enrollment request above.";
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const steps = selectedEnrollment ? getStepsForEnrollment(selectedEnrollment) : [];

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
                        {steps.length > 0 && <EnrollmentProgressTracker steps={steps} />}

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
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-borderCard hover:bg-transparent">
                                            <TableHead className="text-xs text-textSidebarMuted py-4 font-medium w-16">{t("approvalProgress.enrolledPrograms.columns.no")}</TableHead>
                                            <TableHead className="text-xs text-textSidebarMuted py-4 font-medium">{t("approvalProgress.enrolledPrograms.columns.title")}</TableHead>
                                            <TableHead className="text-xs text-textSidebarMuted py-4 font-medium">{t("approvalProgress.enrolledPrograms.columns.fromDate")}</TableHead>
                                            <TableHead className="text-xs text-textSidebarMuted py-4 font-medium">{t("approvalProgress.enrolledPrograms.columns.toDate")}</TableHead>
                                            <TableHead className="text-xs text-textSidebarMuted py-4 font-medium">{t("approvalProgress.enrolledPrograms.columns.venueCity")}</TableHead>
                                            <TableHead className="text-xs text-textSidebarMuted py-4 font-medium">{t("approvalProgress.enrolledPrograms.columns.status")}</TableHead>
                                            <TableHead className="w-10"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {enrollments.map((enrollment, index) => {
                                            const prog = getProgramDetails(enrollment);
                                            return (
                                                <TableRow 
                                                    key={enrollment._id} 
                                                    className={cn(
                                                        "border-borderCard hover:bg-white/5 cursor-pointer transition-all",
                                                        selectedEnrollmentId === enrollment._id ? "bg-white/5 border-l-2 border-l-primary" : ""
                                                    )}
                                                    onClick={() => setSelectedEnrollmentId(enrollment._id)}
                                                >
                                                    <TableCell className="text-sm text-textSidebarMuted py-4">{index + 1}.</TableCell>
                                                    <TableCell className="text-sm text-white font-medium py-4 max-w-xs">{prog?.title || "Unknown"}</TableCell>
                                                    <TableCell className="text-sm text-textSidebarMuted py-4">{formatDate(prog?.startDate)}</TableCell>
                                                    <TableCell className="text-sm text-textSidebarMuted py-4">{formatDate(prog?.endDate)}</TableCell>
                                                    <TableCell className="text-sm text-textSidebarMuted py-4">{prog?.city || prog?.venue || "N/A"}</TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge status={getBadgeStatus(enrollment.status) as any} className="capitalize px-3 py-1">
                                                            {getBadgeLabel(enrollment.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <ChevronRight className="size-4 text-textSidebarMuted" />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
