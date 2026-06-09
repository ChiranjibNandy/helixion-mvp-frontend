"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { t } from "@/lib/i18n";

interface ProgramDetailsCardProps {
    program: any;
    showEnrolledBadge?: boolean;
}

const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

function DetailField({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-textSidebarMuted">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
        </div>
    );
}

export function ProgramDetailsCard({ program, showEnrolledBadge = false }: ProgramDetailsCardProps) {
    const providerName =
        program.providerName ||
        (typeof program.training_providerId === "object"
            ? program.training_providerId.username
            : "Training Provider");

    return (
        <Card className="bg-bgStatCard border-borderCard">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">
                        {t("trainingEnrolment.programDetails.title")}
                    </h2>
                    {showEnrolledBadge && (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-accentGreen">
                            <CheckCircle2 className="size-4" />
                            {t("trainingEnrolment.enrolledLabel")}
                        </span>
                    )}
                </div>

                <div className="rounded-xl border border-borderCard p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-16">
                        <DetailField
                            label={t("trainingEnrolment.programDetails.programTitle")}
                            value={program.title}
                        />
                        <DetailField
                            label={t("trainingEnrolment.programDetails.venue")}
                            value={program.venue || "N/A"}
                        />
                        <DetailField
                            label={t("trainingEnrolment.programDetails.startDate")}
                            value={formatDate(program.startDate)}
                        />
                        <DetailField
                            label={t("trainingEnrolment.programDetails.city")}
                            value={program.city || "N/A"}
                        />
                        <DetailField
                            label={t("trainingEnrolment.programDetails.endDate")}
                            value={formatDate(program.endDate)}
                        />
                        <DetailField
                            label={t("trainingEnrolment.programDetails.trainingProvider")}
                            value={providerName}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
