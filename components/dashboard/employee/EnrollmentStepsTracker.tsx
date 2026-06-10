"use client";

import React from "react";
import { t } from "@/lib/i18n";
import { FileText, UserCheck, ClipboardList, Banknote, Building2 } from "lucide-react";
import EnrollmentProgressTracker from "@/components/ui/EnrollmentProgressTracker";
import { formatDateHyphenated } from "@/utils/formatters";

// Define the Stage constant/enum
export enum ENROLLMENT_STAGE {
    SUBMITTED = "submitted",
    MANAGER_REVIEW = "manager_review",
    TRAINING_DEPT_APPROVAL = "training_dept_approval",
    OSD_REVIEW = "osd_review",
    ATTENDANCE = "attendance",
    REIMBURSEMENT = "reimbursement",
    CREDITED = "credited"
}

interface EnrollmentStepsTrackerProps {
    enrollment: any;
}

export function EnrollmentStepsTracker({ enrollment }: EnrollmentStepsTrackerProps) {
    if (!enrollment) return null;

    const timeline = enrollment.timeline || [];
    
    const getTimelineDate = (stage: string, action?: string) => {
        const log = timeline.find((t: any) => {
            if (action) {
                return t.stage === stage && t.action === action;
            }
            return t.stage === stage;
        });
        return log ? formatDateHyphenated(log.at) : undefined;
    };

    const stage = enrollment.currentStage;

    // Step 1: Application Submitted
    const step1Status: "completed" | "current" | "upcoming" = stage === ENROLLMENT_STAGE.SUBMITTED ? "current" : "completed";
    const step1Date = getTimelineDate(ENROLLMENT_STAGE.SUBMITTED) || formatDateHyphenated(enrollment.createdAt);

    // Step 2: Approved by Reporting Manager
    let step2Status: "completed" | "current" | "upcoming" = "upcoming";
    if (enrollment.managerApproval?.action === "approved") {
        step2Status = "completed";
    } else if (stage === ENROLLMENT_STAGE.MANAGER_REVIEW) {
        step2Status = "current";
    }
    const step2Date = getTimelineDate(ENROLLMENT_STAGE.MANAGER_REVIEW, "approved") || 
        (enrollment.managerApproval?.actedAt ? formatDateHyphenated(enrollment.managerApproval.actedAt) : undefined);

    // Step 3: HR / Training Department Review
    let step3Status: "completed" | "current" | "upcoming" = "upcoming";
    if (
        stage === ENROLLMENT_STAGE.ATTENDANCE || 
        stage === ENROLLMENT_STAGE.REIMBURSEMENT || 
        stage === ENROLLMENT_STAGE.CREDITED
    ) {
        step3Status = "completed";
    } else if (stage === ENROLLMENT_STAGE.TRAINING_DEPT_APPROVAL || stage === ENROLLMENT_STAGE.OSD_REVIEW) {
        step3Status = "current";
    }
    const step3Date = getTimelineDate(ENROLLMENT_STAGE.TRAINING_DEPT_APPROVAL, "approved") || getTimelineDate(ENROLLMENT_STAGE.OSD_REVIEW, "approved");

    // Step 4: Reimbursement Submitted
    let step4Status: "completed" | "current" | "upcoming" = "upcoming";
    if (stage === ENROLLMENT_STAGE.CREDITED) {
        step4Status = "completed";
    } else if (stage === ENROLLMENT_STAGE.REIMBURSEMENT) {
        step4Status = "current";
    }
    const step4Date = getTimelineDate(ENROLLMENT_STAGE.REIMBURSEMENT, "submitted");

    // Step 5: Reimbursement Credited
    const step5Status: "completed" | "current" | "upcoming" = stage === ENROLLMENT_STAGE.CREDITED ? "completed" : "upcoming";
    const step5Date = getTimelineDate(ENROLLMENT_STAGE.CREDITED);

    const steps = [
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

    return <EnrollmentProgressTracker steps={steps} />;
}
