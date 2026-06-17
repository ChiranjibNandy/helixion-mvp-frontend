"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { StepperStep } from "@/types";

interface StepperHeaderProps {
    activeStep: number;
    steps: readonly StepperStep[];
}

export function StepperHeader({ activeStep, steps }: StepperHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            {steps.map((step, idx) => {
                const status =
                    activeStep > step.number
                        ? "completed"
                        : activeStep === step.number
                            ? "active"
                            : "upcoming";

                return (
                <React.Fragment key={step.number}>
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                "size-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                                status === "completed" && "bg-accentGreen border-accentGreen text-white",
                                status === "active" && "bg-primary border-primary text-white",
                                status === "upcoming" && "border-borderCard text-textSidebarMuted bg-transparent"
                            )}
                        >
                            {status === "completed" ? (
                                <CheckCircle2 className="size-4" />
                            ) : (
                                step.number
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-sm font-medium whitespace-nowrap",
                                status === "upcoming" ? "text-textSidebarMuted" : "text-white"
                            )}
                        >
                            {t(step.labelKey)}
                        </span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div
                            className={cn(
                                "w-10 h-0.5 transition-colors",
                                status === "completed" ? "bg-primary" : "bg-borderCard"
                            )}
                        />
                    )}
                </React.Fragment>
                );
            })}
        </div>
    );
}
