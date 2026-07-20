"use client";

import React, { useState } from "react";
import AppModal from "@/components/ui/app-modal";
import { TravelDetailsForm } from "./enrolment/TravelDetailsForm";
import { submitTourForm } from "@/services/employeeService";
import { BookingRow, TRAVEL_TYPE, TourFormState } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EMPTY_BOOKING_ROW, TRAVEL_TYPES } from "@/constants/employee";
import { tourSubmissionSchema } from "@/validations/employee";

interface TourSubmissionModalProps {
    enrollmentId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const createBookingRow = (overrides: Partial<Omit<BookingRow, "id">> = {}): BookingRow => ({
    ...EMPTY_BOOKING_ROW,
    ...overrides,
    id: crypto.randomUUID(),
});

export function TourSubmissionModal({ enrollmentId, isOpen, onClose, onSuccess }: TourSubmissionModalProps) {
    const [tourForm, setTourForm] = useState<TourFormState>({
        travelType: "company_assisted",
        placeOfTour: "",
        frequentFlyerNo: "",
        modeOfTravel: "flight",
        purpose: "To Attend Training Program",
        advancePaymentRequired: 0,
        bookingDetails: [],
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

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

    const handleSubmit = async () => {
        setValidationError(null);

        const validation = tourSubmissionSchema.safeParse(tourForm);
        if (!validation.success) {
            const errorMsg = validation.error.errors[0]?.message || "Validation failed";
            return setValidationError(errorMsg);
        }

        try {
            setSubmitting(true);
            const payload = {
                ...tourForm,
                bookingDetails: tourForm.bookingDetails.map(({ id, ...rest }) => rest), // Remove internal ID
            };
            await submitTourForm(enrollmentId, payload);
            toast.success("Tour form submitted successfully");
            onSuccess();
            onClose();
        } catch (err: any) {
            setValidationError(err?.response?.data?.message || "Failed to submit tour form");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Submit Tour Form"
            className="w-[90vw] max-w-6xl"
        >
            <div className="space-y-4">
                <div className="flex gap-4 p-3 border border-borderCard rounded-xl bg-bgMain">
                    {TRAVEL_TYPES.map((type) => (
                        <label key={type.value} className="flex items-center gap-2 text-white text-sm cursor-pointer">
                            <input
                                type="radio"
                                name="travelType"
                                checked={tourForm.travelType === type.value}
                                onChange={() => setTourForm((prev) => ({ ...prev, travelType: type.value as TRAVEL_TYPE }))}
                                className="text-primary accent-primary"
                            />
                            {type.label}
                        </label>
                    ))}
                </div>

                {tourForm.travelType === "company_assisted" ? (
                    <TravelDetailsForm
                        tourForm={tourForm}
                        setTourForm={setTourForm}
                        addBookingRow={addBookingRow}
                        removeBookingRow={removeBookingRow}
                        validationError={validationError}
                        submitting={submitting}
                        onBack={onClose}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <div className="flex justify-end gap-4 border-t border-borderCard pt-4 mt-4">
                        <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={submitting}>Submit as Self Travel</Button>
                    </div>
                )}
            </div>
        </AppModal>
    );
}
