"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { t } from "@/lib/i18n";

export type EnrollmentStepStatus = "completed" | "current" | "upcoming" | "rejected";

export interface EnrollmentStep {
    id: string;
    label: string;
    date?: string;
    status: EnrollmentStepStatus;
    icon: React.ElementType;
}

interface EnrollmentProgressTrackerProps {
    steps: EnrollmentStep[];
    className?: string;
}

const STATUS_BADGE_KEY: Record<EnrollmentStepStatus, string> = {
    completed: "enrollment.status.completed",
    current: "enrollment.status.active",
    upcoming: "enrollment.status.pend",
    rejected: "enrollment.status.rejected",
};

export default function EnrollmentProgressTracker({ steps, className }: EnrollmentProgressTrackerProps) {
    return (
        <div className={cn("w-full py-6", className)}>
            <div className="flex items-center justify-between w-full">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";
                    const isRejected = step.status === "rejected";
                    const isLast = index === steps.length - 1;
                    const isLineFilled = isCompleted;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 bg-bgMain",
                                        isCompleted
                                            ? "bg-accentGreen/10 border-accentGreen text-accentGreen"
                                            : isRejected
                                                ? "bg-accentRed/10 border-accentRed text-accentRed"
                                                : isCurrent
                                                    ? "bg-primary/10 border-primary text-primary ring-4 ring-primary/20"
                                                    : "bg-bgMain border-borderCard text-textSidebarMuted"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="size-6" />
                                    ) : isRejected ? (
                                        <X className="size-6" />
                                    ) : (
                                        <Icon className="size-6" />
                                    )}
                                </div>
                                <div className="absolute top-14 flex flex-col items-center text-center min-w-[140px]">
                                    <span
                                        className={cn(
                                            "text-xs font-semibold leading-tight mb-1.5",
                                            isCompleted
                                                ? "text-accentGreen"
                                                : isRejected
                                                    ? "text-accentRed"
                                                    : isCurrent
                                                        ? "text-white"
                                                        : "text-textSidebarMuted"
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                    <span
                                        className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors border",
                                            isCompleted
                                                ? "bg-accentGreen/15 text-accentGreen border-accentGreen/30"
                                                : isRejected
                                                    ? "bg-accentRed/15 text-accentRed border-accentRed/30"
                                                    : isCurrent
                                                        ? "bg-primary/15 text-primary border-primary/30"
                                                        : "bg-bgMain text-textSidebarMuted border-borderCard"
                                        )}
                                    >
                                        {t(STATUS_BADGE_KEY[step.status])}
                                    </span>

                                    {step.date && (
                                        <span className="text-[10px] text-textSidebarMuted mt-1">{step.date}</span>
                                    )}
                                </div>
                            </div>
                            {!isLast && (
                                <div className="flex-1 h-0.5 mx-2 bg-borderCard relative overflow-hidden">
                                    <div
                                        className={cn(
                                            "absolute inset-0 transition-all duration-500",
                                            isLineFilled ? "bg-accentGreen w-full" : "w-0"
                                        )}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            <div className="h-20" />
        </div>
    );
}
