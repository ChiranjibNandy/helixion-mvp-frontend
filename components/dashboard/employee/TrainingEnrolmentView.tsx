"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppModal from "@/components/ui/app-modal";
import { Loader2, ArrowRight } from "lucide-react";
import {
    getEmployeeProgramById,
    enrollInProgram,
    getEmployeeEnrollments,
    updateTravelDetails,
    submitEnrollment,
} from "@/services/employeeService";
import { StepperHeader } from "./enrolment/StepperHeader";
import { ProgramDetailsCard } from "./enrolment/ProgramDetailsCard";
import { StayTypeCard } from "./enrolment/StayTypeCard";
import { TravelDetailsForm } from "./enrolment/TravelDetailsForm";
import { ReviewEnrolmentCard } from "./enrolment/ReviewEnrolmentCard";
import { BookingRow, TourFormState } from "@/types";
import { EMPTY_BOOKING_ROW } from "@/constants/employee";
import { tourSubmissionSchema } from "@/validations/employee";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STAY_TYPES = [
    { key: "single_occupancy", labelKey: "trainingEnrolment.programDetails.singleOccupancy", feeField: "singleOccupancyFee" },
    { key: "twin_sharing", labelKey: "trainingEnrolment.programDetails.twinSharing", feeField: "twinSharingFee" },
    { key: "non_residential", labelKey: "trainingEnrolment.programDetails.nonResidential", feeField: "nonResidentialFee" },
] as const;

const STEPPER_STEPS = [
    { number: 1, labelKey: "trainingEnrolment.stepper.programDetails" },
    { number: 2, labelKey: "trainingEnrolment.stepper.travelStay" },
    { number: 3, labelKey: "trainingEnrolment.stepper.reviewSubmit" },
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

const createBookingRow = (overrides: Partial<Omit<BookingRow, "id">> = {}): BookingRow => ({
    ...EMPTY_BOOKING_ROW,
    ...overrides,
    id: crypto.randomUUID(),
});

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function TrainingEnrolmentView() {
    const router = useRouter();
    const [programId, setProgramId] = useState<string | null>(null);

    /* ── Core state ── */
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [program, setProgram] = useState<any>(null);
    const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(1);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    /* ── Step 1 state ── */
    const [stayType, setStayType] = useState("twin_sharing");

    // Read initial programId and stayType from search query if present
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const queryId = params.get("programId") || params.get("id");
            const queryStayType = params.get("stayType");
            
            if (queryStayType) {
                setStayType(queryStayType);
            }

            if (queryId) {
                setProgramId(queryId);
            } else {
                setLoading(false);
            }
        }
    }, [router]);

    /* ── Step 2 state ── */
    const [tourForm, setTourForm] = useState<TourFormState>({
        travelType: "company_assisted",
        placeOfTour: "",
        frequentFlyerNo: "",
        modeOfTravel: "flight",
        purpose: "To Attend Training Program",
        advancePaymentRequired: 0,
        bookingDetails: [],
    });

    /* ── Data loading ── */
    useEffect(() => {
        if (!programId) return;

        const loadData = async () => {
            try {
                setLoading(true);
                const progData = await getEmployeeProgramById(programId);
                setProgram(progData);

                const enrollments = await getEmployeeEnrollments();
                const existing = enrollments.find(
                    (e: any) => e.programId === programId || e.programId?._id === programId
                );

                if (existing) {
                    setEnrollmentId(existing._id);
                    setStayType(
                        existing.stayType || existing.travelAndStay?.stayType || "twin_sharing"
                    );

                    if (existing.travelAndStay) {
                        const ts = existing.travelAndStay;
                        setTourForm((prev) => ({
                            ...prev,
                            placeOfTour: ts.placeOfTour || progData.city || "",
                            frequentFlyerNo: ts.frequentFlyerNo || "",
                            modeOfTravel: ts.modeOfTravel || "flight",
                            purpose: ts.purpose || "To Attend Training Program",
                            advancePaymentRequired: ts.advancePaymentRequired || 0,
                            bookingDetails: ts.bookingDetails?.length
                                ? ts.bookingDetails.map((b: any) => ({
                                      id: b.id || crypto.randomUUID(),
                                      ...b,
                                      travelDate: b.travelDate
                                          ? new Date(b.travelDate).toISOString().split("T")[0]
                                          : "",
                                  }))
                                : [],
                        }));
                    } else {
                        setTourForm((prev) => ({
                            ...prev,
                            placeOfTour: progData.city || progData.venue || "",
                        }));
                    }

                    // Past the initial submission stage → redirect to tracker
                    if (existing.currentStage !== "submitted") {
                        router.push("/dashboard/approvals");
                        return;
                    }
                    
                    const resolvedStayType = existing.stayType || existing.travelAndStay?.stayType || "twin_sharing";
                    if (resolvedStayType === "non_residential") {
                        setActiveStep(3);
                        setShowConfirmModal(true);
                    } else {
                        setActiveStep(2);
                    }
                } else {
                    setTourForm((prev) => ({
                        ...prev,
                        placeOfTour: progData.city || progData.venue || "",
                        bookingDetails: [],
                    }));
                }
            } catch (err) {
                console.error("Failed to load enrollment details:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [programId, router]);

    /* ── Step handlers ── */
    const handleStep1Submit = async () => {
        if (!programId) return;
        try {
            setSubmitting(true);
            const result = await enrollInProgram(programId, stayType as any);
            setEnrollmentId(result.enrollmentId);
            if (stayType === "non_residential") {
                setActiveStep(3);
                setShowConfirmModal(true);
            } else {
                setActiveStep(2);
            }
        } catch (err) {
            console.error("Failed to create enrollment:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStep2Submit = async () => {
        if (!enrollmentId) return;
        setValidationError(null);

        const validation = tourSubmissionSchema.safeParse(tourForm);
        if (!validation.success) {
            const errorMsg = validation.error.errors[0]?.message || "Validation failed";
            return setValidationError(errorMsg);
        }

        try {
            setSubmitting(true);
            await updateTravelDetails(enrollmentId, {
                placeOfTour: tourForm.placeOfTour,
                frequentFlyerNo: tourForm.frequentFlyerNo,
                modeOfTravel: tourForm.modeOfTravel,
                purpose: tourForm.purpose,
                bookingDetails: tourForm.bookingDetails.map(({ id, ...row }) => row),
                advancePaymentRequired: tourForm.advancePaymentRequired,
            });
            setActiveStep(3);
            setShowConfirmModal(true);
        } catch (err) {
            console.error("Failed to update travel details:", err);
            setValidationError("Failed to save travel details. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleFinalSubmit = async () => {
        if (!enrollmentId) return;
        try {
            setSubmitting(true);
            setShowConfirmModal(false);
            await submitEnrollment(enrollmentId);
            router.push("/dashboard/approvals");
        } catch (err) {
            console.error("Failed to submit enrollment:", err);
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Booking row helpers ── */
    const addBookingRow = () => {
        setTourForm((prev) => ({
            ...prev,
            bookingDetails: [...prev.bookingDetails, createBookingRow()],
        }));
    };

    const removeBookingRow = (id: string) => {
        setTourForm((prev) => ({
            ...prev,
            bookingDetails: prev.bookingDetails.filter((row) => row.id !== id),
        }));
    };

    /* ── Loading / Error states ── */
    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!programId) {
        return (
            <div className="flex flex-col gap-6 pb-10 w-full animate-in fade-in-50 duration-300">
                <div className="flex flex-col gap-1 border-b border-borderCard pb-5">
                    <h1 className="text-white text-3xl font-bold font-sans">
                        {t("trainingEnrolment.title")}
                    </h1>
                </div>Access token is required

                <Card className="bg-bgStatCard border-borderCard p-8 text-center text-white max-w-xl mx-auto space-y-5 rounded-2xl shadow-xl mt-10">
                    <p className="text-textSidebarMuted text-sm">
                        Please select an upcoming training program from the Programs menu to enroll.
                    </p>
                    <Button 
                        onClick={() => router.push("/dashboard/programs")}
                        className="px-5 py-2.5 bg-primary text-white font-medium text-sm rounded-xl hover:bg-primary/90 transition-all duration-200"
                    >
                        Browse programs to enroll
                    </Button>
                </Card>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="text-center text-white py-10">
                <p>{t("programme.list.fetchError")}</p>
            </div>
        );
    }

    /* ── Render ── */
    return (
        <div className="flex flex-col gap-6 pb-10 w-full">
            {/* Page header + stepper */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <h1 className="text-white text-3xl font-bold leading-tight">
                    {t("trainingEnrolment.title")}
                </h1>
                <StepperHeader activeStep={activeStep} steps={STEPPER_STEPS} />
            </div>

            {/* ────────────────────────────────────────────────────────── */}
            {/*  Step 1 — Program Details & Stay Type                     */}
            {/* ────────────────────────────────────────────────────────── */}
            {activeStep === 1 && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <ProgramDetailsCard program={program} />

                    {/* Stay Type selection */}
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-white">
                            {t("trainingEnrolment.programDetails.stayType")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {STAY_TYPES.map((opt) => (
                                <StayTypeCard
                                    key={opt.key}
                                    label={t(opt.labelKey)}
                                    fee={program[opt.feeField]}
                                    selected={stayType === opt.key}
                                    onSelect={() => setStayType(opt.key)}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-textSidebarMuted">
                            {t("trainingEnrolment.accommodationInstruction")}
                        </p>
                    </div>

                    {/* Full-width CTA */}
                    <Button
                        id="step1-next-btn"
                        onClick={handleStep1Submit}
                        disabled={submitting}
                        className="w-full h-12 text-base font-semibold rounded-xl"
                    >
                        {submitting && <Loader2 className="size-5 animate-spin" />}
                        {t("trainingEnrolment.confirmEnrollButton")}
                        {!submitting && <ArrowRight className="size-5" />}
                    </Button>

                    <p className="text-sm text-textSidebarMuted text-center">
                        {t("trainingEnrolment.enrollInstruction")}
                    </p>
                </div>
            )}

            {/* ────────────────────────────────────────────────────────── */}
            {/*  Steps 2 & 3 — Travel Details + Booking                   */}
            {/* ────────────────────────────────────────────────────────── */}
            {activeStep >= 2 && stayType !== "non_residential" && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <ProgramDetailsCard program={program} showEnrolledBadge />

                    <TravelDetailsForm
                        tourForm={tourForm}
                        setTourForm={setTourForm}
                        addBookingRow={addBookingRow}
                        removeBookingRow={removeBookingRow}
                        validationError={validationError}
                        submitting={submitting}
                        onBack={() => {
                            setValidationError(null);
                            setActiveStep(1);
                        }}
                        onSubmit={handleStep2Submit}
                    />
                </div>
            )}

            {activeStep === 3 && stayType === "non_residential" && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <ProgramDetailsCard program={program} showEnrolledBadge />

                    <ReviewEnrolmentCard
                        submitting={submitting}
                        onBack={() => setActiveStep(1)}
                        onSubmit={() => setShowConfirmModal(true)}
                    />
                </div>
            )}

            {/* Confirmation Modal (Step 3) */}
            <AppModal
                isOpen={showConfirmModal}
                type="confirm"
                title={t("trainingEnrolment.confirmSubmission")}
                description={t("trainingEnrolment.confirmSubmissionDesc")}
                confirmLabel={t("trainingEnrolment.agree")}
                cancelLabel={t("trainingEnrolment.disagree")}
                loading={submitting}
                onConfirm={handleFinalSubmit}
                onCancel={() => {
                    setShowConfirmModal(false);
                    if (stayType === "non_residential") {
                        setActiveStep(1);
                    } else {
                        setActiveStep(2);
                    }
                }}
            />
        </div>
    );
}
