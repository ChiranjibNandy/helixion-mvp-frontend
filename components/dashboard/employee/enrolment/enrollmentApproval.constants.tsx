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
    if (stage === ENROLLMENT_STAGE.TRAINING_DEPT_APPROVAL) {
        return t("approvalProgress.statusMessages.hrReview");
    }
    if (stage === ENROLLMENT_STAGE.OSD_REVIEW) {
        return t("approvalProgress.statusMessages.osdReview");
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
            return program?.city || program?.venue || "N/A";
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
