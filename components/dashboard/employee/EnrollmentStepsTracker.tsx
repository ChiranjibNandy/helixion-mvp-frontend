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
    TP_PENDING_CONFIRMATION = "tp_pending_confirmation",
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
    ENROLLMENT_STAGE.TP_PENDING_CONFIRMATION,
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
// Mirrors backend ACTOR_TYPE / MANAGER_ACTION / TRAINING_DEPT_SENIOR_ACTION /
// ENROLLMENT_REJECTION_REASON (helixion-mvp-backend/src/constants/enum.ts) —
// same manual-sync caveat as ENROLLMENT_STAGE above.
const ACTOR = { MANAGER: "manager", TRAINING_DEPT: "training_dept", PROVIDER: "provider", SYSTEM: "system" } as const;
const DECISION = { APPROVE: "approve", REJECT: "reject" } as const;
const REJECTION_REASONS = ["manager", "training_dept", "training_provider", "quota_full"] as const;
type RejectionReason = (typeof REJECTION_REASONS)[number];

// Who/what moved an enrollment into REJECTED. currentStage alone can't tell —
// the manager, the CTD senior officer, the Training Provider, the quota
// auto-reject and the reimbursement reviewers all land on the same stage.
// "other" covers post-approval rejections (reimbursement manager/OSD).
type RejectedBy = RejectionReason | "other" | null;

const findLast = (timeline: any[], predicate: (entry: any) => boolean) => {
    for (let i = timeline.length - 1; i >= 0; i--) {
        if (predicate(timeline[i])) return timeline[i];
    }
    return undefined;
};

const getRejectedBy = (enrollment: any, rejectionEntry: any): RejectedBy => {
    if (enrollment.currentStage !== ENROLLMENT_STAGE.REJECTED) return null;

    // Backend sets rejectionReason for every pre-approval rejection path.
    if (REJECTION_REASONS.includes(enrollment.rejectionReason)) return enrollment.rejectionReason;

    // Older records without rejectionReason — infer from the timeline entry.
    if (rejectionEntry) {
        if (rejectionEntry.action === DECISION.REJECT && rejectionEntry.actorType === ACTOR.MANAGER) return "manager";
        if (rejectionEntry.action === DECISION.REJECT && rejectionEntry.actorType === ACTOR.TRAINING_DEPT) return "training_dept";
        if (rejectionEntry.actorType === ACTOR.PROVIDER) return "training_provider";
        if (rejectionEntry.actorType === ACTOR.SYSTEM && String(rejectionEntry.action).includes("quota")) return "quota_full";
        return "other";
    }
    // No timeline entry either — fall back to the decision fields.
    if (enrollment.managerApproval?.action === DECISION.REJECT) return "manager";
    if (enrollment.trainingDeptReview?.seniorAction === DECISION.REJECT) return "training_dept";
    return "other";
};

type StepStatus = "completed" | "current" | "upcoming" | "rejected";

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

    const rejectionEntry = findLast(timeline, (e) => e.stage === ENROLLMENT_STAGE.REJECTED);
    const rejectedBy = getRejectedBy(enrollment, rejectionEntry);
    const rejectionDate = rejectionEntry ? formatDateHyphenated(rejectionEntry.at) : undefined;

    // Manager's final enrollment decision (approve | reject). "recommend"
    // entries are intermediate multi-level hops, not the final decision;
    // tour/reimbursement manager actions use distinct "tour_*" /
    // "reimbursement_*" action strings, so they never match here.
    const managerDecision = findLast(
        timeline,
        (e) => e.actorType === ACTOR.MANAGER && (e.action === DECISION.APPROVE || e.action === DECISION.REJECT)
    );
    const managerApproved = managerDecision?.action === DECISION.APPROVE;
    // CTD senior officer's decision. Junior officers log "reviewed", and the
    // tour leg logs "tour_ctd_*", so neither is mistaken for this.
    const ctdDecision = findLast(
        timeline,
        (e) => e.actorType === ACTOR.TRAINING_DEPT && (e.action === DECISION.APPROVE || e.action === DECISION.REJECT)
    );

    // Quota auto-reject only hits enrollments still in manager_review or
    // training_dept_review — mark whichever of those was in progress.
    const quotaRejectedAtManager = rejectedBy === "quota_full" && !managerApproved;
    const quotaRejectedAtCtd = rejectedBy === "quota_full" && managerApproved;

    // Step 2: Reporting Manager review
    let step2Status: StepStatus = "upcoming";
    if (rejectedBy === "manager" || quotaRejectedAtManager) {
        step2Status = "rejected";
    } else if (PAST_MANAGER_REVIEW.includes(stage)) {
        step2Status = "completed";
    } else if (stage === ENROLLMENT_STAGE.MANAGER_REVIEW) {
        step2Status = "current";
    } else if (
        rejectedBy === "training_dept" || rejectedBy === "training_provider" || quotaRejectedAtCtd ||
        (rejectedBy === "other" && managerApproved)
    ) {
        // Rejected later in the flow — the manager must have approved for
        // the enrollment to get there.
        step2Status = "completed";
    }
    const managerDate = managerDecision
        ? formatDateHyphenated(managerDecision.at)
        : enrollment.managerApproval?.actedAt
            ? formatDateHyphenated(enrollment.managerApproval.actedAt)
            : undefined;
    const step2Date = step2Status === "rejected"
        ? (quotaRejectedAtManager ? rejectionDate : managerDate ?? rejectionDate)
        : step2Status === "completed" ? managerDate : undefined;
    const step2LabelKey: Record<StepStatus, string> = {
        upcoming: "approvalProgress.steps.managerUpcoming",
        current: "approvalProgress.steps.managerInReview",
        completed: "approvalProgress.steps.manager",
        rejected: quotaRejectedAtManager ? "approvalProgress.steps.rejectedQuotaFull" : "approvalProgress.steps.managerRejected",
    };

    // Training Dept review is skippable per org policy (see backend
    // takeManagerActionService) — an enrollment can move past the manager
    // without ever getting a CTD senior decision. Tour-leg CTD actions
    // (tour_ctd_approve/tour_ctd_reject) push entries with the same
    // actorType "training_dept" as the main review, so ctdDecision only
    // matches the bare approve/reject actions.

    // Step 3: CTD / Training Dept Review
    let step3Status: StepStatus = "upcoming";
    if (rejectedBy === "training_dept" || quotaRejectedAtCtd) {
        step3Status = "rejected";
    } else if (PAST_TRAINING_DEPT_REVIEW.includes(stage)) {
        step3Status = "completed";
    } else if (stage === ENROLLMENT_STAGE.TRAINING_DEPT_REVIEW) {
        step3Status = "current";
    } else if (
        rejectedBy === "training_provider" ||
        (rejectedBy === "other" &&
            (ctdDecision?.action === DECISION.APPROVE ||
                (managerApproved && enrollment.policySnapshot?.trainingDeptApproval?.enabled === false)))
    ) {
        // Rejected after CTD (TP decline / reimbursement) — CTD either
        // approved or was skipped by org policy.
        step3Status = "completed";
    }
    const ctdDate = ctdDecision ? formatDateHyphenated(ctdDecision.at) : undefined;
    const step3Date = step3Status === "rejected"
        ? (quotaRejectedAtCtd ? rejectionDate : ctdDate ?? rejectionDate)
        : step3Status === "completed" ? ctdDate : undefined;
    const step3Label = step3Status !== "rejected"
        ? "approvalProgress.steps.hrReview"
        : quotaRejectedAtCtd ? "approvalProgress.steps.rejectedQuotaFull" : "approvalProgress.steps.hrReviewRejected";

    // Step: Training Provider confirmation
    let stepTpStatus: StepStatus = "upcoming";
    if (rejectedBy === "training_provider") {
        stepTpStatus = "rejected";
    } else if (stage === ENROLLMENT_STAGE.TP_PENDING_CONFIRMATION) {
        stepTpStatus = "current";
    } else if (enrollment.tpConfirmation?.confirmedAt) {
        stepTpStatus = "completed";
    }
    const stepTpDate = stepTpStatus === "rejected"
        ? rejectionDate
        : enrollment.tpConfirmation?.confirmedAt
            ? formatDateHyphenated(enrollment.tpConfirmation.confirmedAt)
            : undefined;
    const stepTpLabel = stepTpStatus === "rejected"
        ? "approvalProgress.steps.tpDeclined"
        : "approvalProgress.steps.tpConfirmation";

    // Step 3.5: Tour / CTD final review — only relevant for outstation enrollments
    // that need company-assisted travel; skipped entirely for local training
    // or Self Travel (tour.status stays NOT_REQUIRED for both).
    const hasCtdTourReview = enrollment.tour?.status !== "not_required" && (TOUR_STAGES.includes(stage) || PAST_TOUR.includes(stage));
    let stepCtdTourStatus: StepStatus = "upcoming";
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
            label: t(step2LabelKey[step2Status]),
            date: step2Date,
            status: step2Status,
            icon: UserCheck,
        },
        {
            id: "3",
            label: t(step3Label),
            date: step3Date,
            status: step3Status,
            icon: ClipboardList,
        },
        {
            id: "3-tp-confirmation",
            label: t(stepTpLabel),
            date: stepTpDate,
            status: stepTpStatus,
            icon: UserCheck,
        }
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
