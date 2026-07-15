"use client";

import React, { useState } from "react";
import AppModal from "@/components/ui/app-modal";
import { TravelDetailsForm } from "./enrolment/TravelDetailsForm";
import { submitTourForm } from "@/services/employeeService";
import { TRAVEL_TYPE } from "@/types";
import { BookingRow } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TourSubmissionModalProps {
    enrollmentId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EMPTY_BOOKING_ROW = {
    id: "",
    from: "",
    to: "",
    refNo: "",
    departureTime: "",
    travelDate: "",
    travelClass: "Economy",
};

const createBookingRow = (overrides: Partial<Omit<BookingRow, "id">> = {}): BookingRow => ({
    ...EMPTY_BOOKING_ROW,
    ...overrides,
    id: crypto.randomUUID(),
});

export function TourSubmissionModal({ enrollmentId, isOpen, onClose, onSuccess }: TourSubmissionModalProps) {
    const [travelType, setTravelType] = useState<TRAVEL_TYPE>("company_assisted" as any);
    const [placeOfTour, setPlaceOfTour] = useState("");
    const [frequentFlyerNo, setFrequentFlyerNo] = useState("");
    const [modeOfTravel, setModeOfTravel] = useState("flight");
    const [purpose, setPurpose] = useState("To Attend Training Program");
    const [advancePaymentRequired, setAdvancePaymentRequired] = useState(0);
    const [bookingDetails, setBookingDetails] = useState<BookingRow[]>([]);
    
    const [submitting, setSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const addBookingRow = () => setBookingDetails((prev) => [...prev, createBookingRow()]);
    const removeBookingRow = (id: string) => setBookingDetails((prev) => prev.filter((row) => row.id !== id));
    const updateBookingField = (id: string, field: keyof BookingRow, value: string) => {
        setBookingDetails((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    };

    const handleSubmit = async () => {
        setValidationError(null);

        if (travelType === "company_assisted") {
            if (!placeOfTour || !placeOfTour.trim()) return setValidationError("Place of Tour is required.");
            if (!frequentFlyerNo || !frequentFlyerNo.trim()) return setValidationError("Frequent Flyer No. is required.");
            if (!modeOfTravel) return setValidationError("Mode of Travel is required.");
            if (!purpose || !purpose.trim()) return setValidationError("Tour Purpose is required.");
            if (!bookingDetails || bookingDetails.length === 0) return setValidationError("Please add at least one booking detail route.");

            for (let i = 0; i < bookingDetails.length; i++) {
                const row = bookingDetails[i];
                if (!row.from || !row.from.trim()) return setValidationError(`Booking Route ${i + 1}: 'From' city is required.`);
                if (!row.to || !row.to.trim()) return setValidationError(`Booking Route ${i + 1}: 'To' city is required.`);
                if (!row.refNo || !row.refNo.trim()) return setValidationError(`Booking Route ${i + 1}: Flight/Train Ref No. is required.`);
                if (!row.departureTime || !row.departureTime.trim()) return setValidationError(`Booking Route ${i + 1}: Departure Time is required.`);
                if (!row.travelDate) return setValidationError(`Booking Route ${i + 1}: Date of Travel is required.`);
            }
        }

        try {
            setSubmitting(true);
            const payload = {
                travelType,
                placeOfTour,
                frequentFlyerNo,
                modeOfTravel,
                purpose,
                advancePaymentRequired,
                bookingDetails: bookingDetails.map(({ id, ...rest }) => rest), // Remove internal ID
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

    // Need a simple wrapper to choose self_travel vs company_assisted
    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Submit Tour Form"
            className="max-w-4xl"
        >
            <div className="space-y-6">
                <div className="flex gap-4 p-4 border border-borderCard rounded-xl bg-bgMain">
                    <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                        <input
                            type="radio"
                            name="travelType"
                            checked={travelType === "company_assisted"}
                            onChange={() => setTravelType("company_assisted" as any)}
                            className="text-primary accent-primary"
                        />
                        Company Assisted
                    </label>
                    <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                        <input
                            type="radio"
                            name="travelType"
                            checked={travelType === "self_travel"}
                            onChange={() => setTravelType("self_travel" as any)}
                            className="text-primary accent-primary"
                        />
                        Self Travel
                    </label>
                </div>

                {travelType === "company_assisted" ? (
                    <TravelDetailsForm
                        placeOfTour={placeOfTour}
                        setPlaceOfTour={setPlaceOfTour}
                        frequentFlyerNo={frequentFlyerNo}
                        setFrequentFlyerNo={setFrequentFlyerNo}
                        modeOfTravel={modeOfTravel}
                        setModeOfTravel={setModeOfTravel}
                        purpose={purpose}
                        setPurpose={setPurpose}
                        bookingDetails={bookingDetails}
                        addBookingRow={addBookingRow}
                        removeBookingRow={removeBookingRow}
                        updateBookingField={updateBookingField}
                        advancePaymentRequired={advancePaymentRequired}
                        setAdvancePaymentRequired={setAdvancePaymentRequired}
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
