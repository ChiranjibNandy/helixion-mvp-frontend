"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STEPPER_STEPS = [
    { number: 1, labelKey: "trainingEnrolment.stepper.programDetails" },
    { number: 2, labelKey: "trainingEnrolment.stepper.travelStay" },
    { number: 3, labelKey: "trainingEnrolment.stepper.reviewSubmit" },
] as const;

interface StepperHeaderProps {
    activeStep: number;
}

export function StepperHeader({ activeStep }: StepperHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            {STEPPER_STEPS.map((step, idx) => (
                <React.Fragment key={step.number}>
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                "size-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                                activeStep > step.number && "bg-accentGreen border-accentGreen text-white",
                                activeStep === step.number && "bg-primary border-primary text-white",
                                activeStep < step.number && "border-borderCard text-textSidebarMuted bg-transparent"
                            )}
                        >
                            {activeStep > step.number ? (
                                <CheckCircle2 className="size-4" />
                            ) : (
                                step.number
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-sm font-medium whitespace-nowrap",
                                activeStep >= step.number ? "text-white" : "text-textSidebarMuted"
                            )}
                        >
                            {t(step.labelKey)}
                        </span>
                    </div>
                    {idx < STEPPER_STEPS.length - 1 && (
                        <div
                            className={cn(
                                "w-10 h-0.5 transition-colors",
                                activeStep > step.number ? "bg-primary" : "bg-borderCard"
                            )}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
