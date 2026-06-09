"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

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
                    Review Enrolment
                </h2>
                <p className="text-textSidebarMuted text-sm">
                    You have selected the <strong>Non-Residential</strong> stay option. No travel tour or travel bookings are required for this program.
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
