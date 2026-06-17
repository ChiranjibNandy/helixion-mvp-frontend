"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { t } from "@/lib/i18n";

interface ReviewEnrolmentCardProps {
    submitting: boolean;
    onBack: () => void;
    onSubmit: () => void;
}

export function ReviewEnrolmentCard({ submitting, onBack, onSubmit }: ReviewEnrolmentCardProps) {
    return (
        <Card className="bg-bgStatCard border-borderCard">
            <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-bold text-white">
                    {t("trainingEnrolment.reviewEnrolmentTitle")}
                </h2>
                <p className="text-textSidebarMuted text-sm">
                    {t("trainingEnrolment.reviewEnrolmentDescription")}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-borderCard">
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="gap-1.5"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={submitting}
                        className="gap-2"
                    >
                        {submitting && <Loader2 className="size-4 animate-spin" />}
                        Submit Enrolment
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
