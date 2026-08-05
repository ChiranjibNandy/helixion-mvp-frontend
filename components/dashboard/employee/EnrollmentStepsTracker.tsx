"use client";

import React from "react";
import { t } from "@/lib/i18n";
import { FileText, UserCheck, ClipboardList } from "lucide-react";
import EnrollmentProgressTracker from "@/components/ui/EnrollmentProgressTracker";
import { formatDateHyphenated } from "@/utils/formatters";

// Mirrors the backend's ENROLLMENT_STAGE enum (helixion-mvp-backend/src/constants/enum.ts).
// These live in two separate repos, so this can't be a shared import — if the
// backend renames a stage, this map needs a matching update.
export enum ENROLLMENT_STAGE {
    SUBMITTED = "submitted",
    MANAGER_REVIEW = "manager_review",
    TRAINING_DEPT_REVIEW = "training_dept_review",
    APPROVED = "approved",
    TOUR_PENDING_EMPLOYEE = "tour_pending_employee",
    TOUR_MANAGER_REVIEW = "tour_manager_review",
    TOUR_CTD_REVIEW = "tour_ctd_review",
    REJECTED = "rejected",
    ATTENDED = "attended",
    ABSENT = "absent",
    REIMBURSEMENT_SUBMITTED = "reimbursement_submitted",
    REIMBURSEMENT_MANAGER_REVIEW = "reimbursement_manager_review",
    REIMBURSEMENT_OSD_REVIEW = "reimbursement_osd_review",
    COMPLETED = "completed",
}

// Stages reached only once an enrollment has moved past Manager review —
// used below to mark step 2 "completed" without relying on a raw action
// string (which varies: "approve", "reject", multi-level "recommend").
const PAST_MANAGER_REVIEW: string[] = [
    ENROLLMENT_STAGE.TRAINING_DEPT_REVIEW, ENROLLMENT_STAGE.APPROVED,
    ENROLLMENT_STAGE.TOUR_PENDING_EMPLOYEE, ENROLLMENT_STAGE.TOUR_MANAGER_REVIEW, ENROLLMENT_STAGE.TOUR_CTD_REVIEW,
    ENROLLMENT_STAGE.ATTENDED, ENROLLMENT_STAGE.ABSENT,
    ENROLLMENT_STAGE.REIMBURSEMENT_SUBMITTED, ENROLLMENT_STAGE.REIMBURSEMENT_MANAGER_REVIEW, ENROLLMENT_STAGE.REIMBURSEMENT_OSD_REVIEW,
    ENROLLMENT_STAGE.COMPLETED,
];
const PAST_TRAINING_DEPT_REVIEW: string[] = PAST_MANAGER_REVIEW.filter((s) => s !== ENROLLMENT_STAGE.TRAINING_DEPT_REVIEW);
const TOUR_STAGES: string[] = [ENROLLMENT_STAGE.TOUR_PENDING_EMPLOYEE, ENROLLMENT_STAGE.TOUR_MANAGER_REVIEW, ENROLLMENT_STAGE.TOUR_CTD_REVIEW];
// APPROVED is included here because takeTourManagerActionService and
// takeTourCtdActionService both land the enrollment on APPROVED immediately
// after a tour decision (approve or reject) — without it, the tour step
// would vanish from the tracker the instant it's actually resolved. This is
// safe for local-training enrollments that reach APPROVED without ever
// needing a tour: hasCtdTourReview also requires tour.status !== "not_required",
// which stays NOT_REQUIRED for those, so the step still correctly stays hidden.
const PAST_TOUR: string[] = [
    ENROLLMENT_STAGE.APPROVED,
    ENROLLMENT_STAGE.ATTENDED, ENROLLMENT_STAGE.ABSENT,
    ENROLLMENT_STAGE.REIMBURSEMENT_SUBMITTED, ENROLLMENT_STAGE.REIMBURSEMENT_MANAGER_REVIEW, ENROLLMENT_STAGE.REIMBURSEMENT_OSD_REVIEW,
    ENROLLMENT_STAGE.COMPLETED,
];
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

    const stage: string = enrollment.currentStage;

    // Step 1: Application Submitted
    const step1Status: "completed" | "current" | "upcoming" = stage === ENROLLMENT_STAGE.SUBMITTED ? "current" : "completed";
    const step1Date = getTimelineDate(ENROLLMENT_STAGE.SUBMITTED) || formatDateHyphenated(enrollment.createdAt);

    // Step 2: Approved by Reporting Manager
    let step2Status: "completed" | "current" | "upcoming" = "upcoming";
    if (PAST_MANAGER_REVIEW.includes(stage) || stage === ENROLLMENT_STAGE.REJECTED) {
        step2Status = "completed";
    } else if (stage === ENROLLMENT_STAGE.MANAGER_REVIEW) {
        step2Status = "current";
    }
    const step2Date = getTimelineDate(ENROLLMENT_STAGE.TRAINING_DEPT_REVIEW, "approve") ||
        (enrollment.managerApproval?.actedAt ? formatDateHyphenated(enrollment.managerApproval.actedAt) : undefined);

    // Training Dept review is skippable per org policy (see backend
    // takeManagerActionService) — an enrollment that reaches a
    // post-manager-review stage without ever having a training_dept_review
    // timeline entry had it skipped, not pending. Tour-leg CTD actions
    // (tour_ctd_approve/tour_ctd_reject) push entries with the same
    // actorType "training_dept" as the main review, so they're explicitly
    // excluded here — otherwise a tour approval alone would be mistaken for
    // evidence the main review ran, permanently stuck step 3 on "upcoming".
    const wasTrainingDeptSkipped = !timeline.some((t: any) => t.actorType === "training_dept" && !String(t.action || "").startsWith("tour_ctd_")) && stage !== ENROLLMENT_STAGE.TRAINING_DEPT_REVIEW;

    // Step 3: CTD / Training Dept Review
    let step3Status: "completed" | "current" | "upcoming" = "upcoming";
    if (PAST_TRAINING_DEPT_REVIEW.includes(stage) || wasTrainingDeptSkipped) {
        step3Status = "completed";
    } else if (stage === ENROLLMENT_STAGE.TRAINING_DEPT_REVIEW) {
        step3Status = "current";
    }
    const step3Date = getTimelineDate(ENROLLMENT_STAGE.TOUR_PENDING_EMPLOYEE, "approve");

    // Step 3.5: Tour / CTD final review — only relevant for outstation enrollments
    // that need company-assisted travel; skipped entirely for local training
    // or Self Travel (tour.status stays NOT_REQUIRED for both).
    const hasCtdTourReview = enrollment.tour?.status !== "not_required" && (TOUR_STAGES.includes(stage) || PAST_TOUR.includes(stage));
    let stepCtdTourStatus: "completed" | "current" | "upcoming" = "upcoming";
    if (PAST_TOUR.includes(stage)) {
        stepCtdTourStatus = "completed";
    } else if (TOUR_STAGES.includes(stage)) {
        stepCtdTourStatus = "current";
    }
    const stepCtdTourDate = getTimelineDate(ENROLLMENT_STAGE.APPROVED, "tour_ctd_approve");

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
    ];

    if (hasCtdTourReview) {
        steps.push({
            id: "3-ctd-tour",
            label: t("approvalProgress.steps.ctdTourReview"),
            date: stepCtdTourDate,
            status: stepCtdTourStatus,
            icon: UserCheck,
        });
    }

    return <EnrollmentProgressTracker steps={steps} />;
}
