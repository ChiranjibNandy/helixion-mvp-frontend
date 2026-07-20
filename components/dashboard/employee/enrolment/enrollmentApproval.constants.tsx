import React from "react";
import { ChevronRight } from "lucide-react";
import Badge from "@/components/ui/badge";
import { ENROLLMENT_STAGE } from "../EnrollmentStepsTracker";
import { formatDateHyphenated } from "@/utils/formatters";

export const getProgramDetails = (enrollment: any) => {
    if (!enrollment) return {};
    const program = enrollment.programId;
    return typeof program === "object" && program ? program : (enrollment.programDetails || {});
};

export const getStatusMessage = (enrollment: any, t: (key: string) => string) => {
    const stage = enrollment.currentStage;
    if (stage === ENROLLMENT_STAGE.SUBMITTED) {
        return t("approvalProgress.statusMessages.submitted");
    }
    if (stage === ENROLLMENT_STAGE.MANAGER_REVIEW) {
        return t("approvalProgress.statusMessages.managerReview");
    }
    if (stage === ENROLLMENT_STAGE.TRAINING_DEPT_REVIEW) {
        return t("approvalProgress.statusMessages.hrReview");
    }
    if (stage === ENROLLMENT_STAGE.TOUR_PENDING_EMPLOYEE || stage === ENROLLMENT_STAGE.TOUR_MANAGER_REVIEW || stage === ENROLLMENT_STAGE.TOUR_CTD_REVIEW) {
        return t("approvalProgress.statusMessages.ctdTourReview");
    }
    if (stage === ENROLLMENT_STAGE.ATTENDED || stage === ENROLLMENT_STAGE.ABSENT) {
        return t("approvalProgress.statusMessages.attendance");
    }
    if (stage === ENROLLMENT_STAGE.REIMBURSEMENT_SUBMITTED || stage === ENROLLMENT_STAGE.REIMBURSEMENT_MANAGER_REVIEW || stage === ENROLLMENT_STAGE.REIMBURSEMENT_OSD_REVIEW) {
        return t("approvalProgress.statusMessages.reimbursement");
    }
    if (stage === ENROLLMENT_STAGE.COMPLETED) {
        return t("approvalProgress.statusMessages.credited");
    }
    if (stage === ENROLLMENT_STAGE.REJECTED) {
        return t("approvalProgress.statusMessages.rejected");
    }
    return t("approvalProgress.statusMessages.default");
};

// The list's Status column reads `currentStage` (the real API field —
// there's no separate `status` field on an enrollment) and buckets the
// granular workflow stage into one of four simplified badge states.
// "active" (green) is used for Completed/Approved rather than "completed"
// (blue) specifically because Badge's "completed" and "in_progress" share
// the same blue background — using them together made Approved and
// In Progress rows visually indistinguishable.
const getBadgeStatus = (stage: string) => {
    if (stage === ENROLLMENT_STAGE.COMPLETED || stage === ENROLLMENT_STAGE.APPROVED) return "active";
    if (stage === ENROLLMENT_STAGE.SUBMITTED) return "pending";
    return "in_progress";
};

const getBadgeLabel = (stage: string) => {
    if (stage === ENROLLMENT_STAGE.REJECTED) return "Rejected";
    if (stage === ENROLLMENT_STAGE.COMPLETED) return "Completed";
    if (stage === ENROLLMENT_STAGE.APPROVED) return "Approved";
    if (stage === ENROLLMENT_STAGE.SUBMITTED) return "Pending";
    return "In Progress";
};

export const createEnrollmentColumns = (t: (key: string) => string) => [
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
            const program = getProgramDetails(enrollment);
            return program?.city || program?.venueName || "N/A";
        },
    },
    {
        key: "tourFormRequired",
        header: t("approvalProgress.enrolledPrograms.columns.tourFormRequired"),
        className: "py-4",
        render: (enrollment: any) => {
            if (enrollment.currentStage === ENROLLMENT_STAGE.TOUR_PENDING_EMPLOYEE) {
                return (
                    <Badge status="pending" className="capitalize px-3 py-1">
                        Required
                    </Badge>
                );
            }
            if (enrollment.tour?.status && enrollment.tour.status !== "not_required") {
                return (
                    <Badge status="active" className="capitalize px-3 py-1">
                        Submitted
                    </Badge>
                );
            }
            return <span className="text-sm text-textSidebarMuted">Not Required</span>;
        },
    },
    {
        key: "status",
        header: t("approvalProgress.enrolledPrograms.columns.status"),
        className: "py-4",
        render: (enrollment: any) => {
            const isRejected = enrollment.currentStage === ENROLLMENT_STAGE.REJECTED;
            return (
                <Badge
                    variant={isRejected ? "destructive" : "default"}
                    status={isRejected ? undefined : (getBadgeStatus(enrollment.currentStage) as any)}
                    className="capitalize px-3 py-1"
                >
                    {getBadgeLabel(enrollment.currentStage)}
                </Badge>
            );
        },
    },
    {
        key: "chevron",
        header: "",
        className: "w-10 py-4",
        render: () => <ChevronRight className="size-4 text-textSidebarMuted" />,
    },
];
