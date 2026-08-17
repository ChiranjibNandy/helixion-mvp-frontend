"use client";

import React, { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { getEmployeeEnrollments } from "@/services/employeeService";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DataTable from "@/components/shared/data-table";
import { Spinner } from "@/components/ui/spinner";
import { EnrollmentStepsTracker } from "./EnrollmentStepsTracker";
import {
    createEnrollmentColumns,
    getProgramDetails,
} from "./enrolment/enrollmentApproval.constants";
import { TourSubmissionModal } from "./TourSubmissionModal";

export default function EnrollmentApprovalProgressView() {
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTourModalOpen, setIsTourModalOpen] = useState(false);

    const fetchEnrollments = async () => {
            try {
                setLoading(true);
                const data = await getEmployeeEnrollments();
                setEnrollments(data);
                if (data && data.length > 0) {
                    setSelectedEnrollmentId(data[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch enrollments:", err);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const selectedEnrollment = enrollments.find(e => e._id === selectedEnrollmentId) || enrollments[0];


    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const getRowClassName = (enrollment: any) => {
        return cn(
            "border-borderCard hover:bg-white/5 cursor-pointer transition-all",
            selectedEnrollmentId === enrollment._id ? "bg-white/5 border-l-2 border-l-primary" : ""
        );
    };

    const columns = createEnrollmentColumns(t);

    return (
        <div className="flex flex-col gap-8 pb-10 w-full">
            {/* Header Title without breadcrumbs */}
            <div className="flex flex-col gap-1 border-b border-borderCard pb-5">
                <h1 className="text-white text-3xl font-bold font-sans">
                    {t("approvalProgress.title")}
                </h1>
                <p className="text-textSidebarMuted text-sm">
                    {t("approvalProgress.subtitle")}
                </p>
            </div>

            {enrollments.length === 0 ? (
                <Card className="bg-bgStatCard border-borderCard p-8 text-center text-white space-y-4">
                    <p className="text-textSidebarMuted">
                        You have not enrolled in any training programs yet.
                    </p>
                    <Link 
                        href="/dashboard"
                        className="inline-block px-5 py-2.5 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary/90 transition-all duration-200"
                    >
                        Browse programs to enroll
                    </Link>
                </Card>
            ) : (
                <Card className="bg-bgStatCard border-borderCard p-8">
                    <div className="space-y-12 p-3">
                        {/* Selected Program Title */}
                        <div className="border-b border-white/5 pb-4">
                            <span className="text-[10px] uppercase tracking-wider text-textSidebarMuted font-bold block mb-1">
                                Currently Tracking
                            </span>
                            <h2 className="text-xl font-bold text-white">
                                {getProgramDetails(selectedEnrollment)?.title || "Unknown Program"}
                            </h2>
                        </div>

                        {/* Progress Tracker */}
                        
                        {selectedEnrollment && <EnrollmentStepsTracker enrollment={selectedEnrollment} />}

                        {/* Tour Submission CTA */}
                        {selectedEnrollment?.currentStage === "tour_pending_employee" && (
                            <div className="flex flex-col items-center justify-center p-6 mt-4 border border-borderCard rounded-xl bg-bgMain text-center space-y-4">
                                <h3 className="text-lg font-semibold text-white">Tour Form Required</h3>
                                <p className="text-sm text-textSidebarMuted">
                                    Your enrollment has been approved. Please submit your tour details to proceed.
                                </p>
                                <button
                                    onClick={() => setIsTourModalOpen(true)}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium"
                                >
                                    Submit Tour Details
                                </button>
                            </div>
                        )}

                        {/* Enrolled Programs Table */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                {t("approvalProgress.enrolledPrograms.title")}
                                <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs text-textSidebarMuted font-normal">
                                    {enrollments.length}
                                </span>
                            </h2>
                            <div className="rounded-xl border border-borderCard overflow-hidden">
                                <DataTable
                                    columns={columns}
                                    data={enrollments}
                                    onRowClick={(enrollment) => setSelectedEnrollmentId(enrollment._id)}
                                    rowClassName={getRowClassName}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {selectedEnrollment && (
                <TourSubmissionModal
                    enrollmentId={selectedEnrollment._id}
                    isOpen={isTourModalOpen}
                    onClose={() => setIsTourModalOpen(false)}
                    onSuccess={() => {
                        fetchEnrollments();
                    }}
                />
            )}
        </div>
    );
}
