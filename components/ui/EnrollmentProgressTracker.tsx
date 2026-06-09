"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, ClipboardList, UserCheck, FileText, Banknote, Building2 } from "lucide-react";

interface Step {
    id: string;
    label: string;
    date?: string;
    status: "completed" | "current" | "upcoming";
    icon: React.ElementType;
}

interface EnrollmentProgressTrackerProps {
    steps: Step[];
    className?: string;
}

export default function EnrollmentProgressTracker({ steps, className }: EnrollmentProgressTrackerProps) {
    // Find the furthest index that is completed or current
    const activeIndex = steps.reduce((acc, step, idx) => {
        return step.status === "completed" || step.status === "current" ? idx : acc;
    }, 0);

    const progressPercent = steps.length > 1
        ? Math.max(0, (activeIndex / (steps.length - 1)) * 100)
        : 0;

    return (
        <div className={cn("w-full py-6", className)}>
            <div className="relative flex items-center justify-between">
                {/* Progress Line Wrapper spanning center-to-center of outer circles */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 z-0">
                    {/* Background Line */}
                    <div className="w-full h-full bg-borderCard" />
                    {/* Active Progress Line */}
                    <div
                        className="absolute left-0 top-0 h-full bg-accentGreen transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* steps */}
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            {/* Circle Icon */}
                            <div
                                className={cn(
                                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                                    isCompleted
                                        ? "bg-accentGreen/10 border-accentGreen text-accentGreen"
                                        : isCurrent
                                            ? "bg-primary/10 border-primary text-primary ring-4 ring-primary/20"
                                            : "bg-bgMain border-borderCard text-textSidebarMuted"
                                )}
                            >
                                {isCompleted ? <Check className="size-6" /> : <Icon className="size-6" />}
                            </div>

                            {/* Label and Date */}
                            <div className="absolute top-14 flex flex-col items-center text-center min-w-[120px]">
                                <span
                                    className={cn(
                                        "text-[10px] font-semibold leading-tight",
                                        isCompleted ? "text-accentGreen" : isCurrent ? "text-white" : "text-textSidebarMuted"
                                    )}
                                >
                                    {step.label}
                                </span>
                                {step.date && <span className="text-[10px] text-textSidebarMuted mt-1">{step.date}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Spacer for the absolute labels */}
            <div className="h-20" />
        </div>
    );
}
