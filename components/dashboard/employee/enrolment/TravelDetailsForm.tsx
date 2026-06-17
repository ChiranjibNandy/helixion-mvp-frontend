"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { t } from "@/lib/i18n";

import { TravelDetailsFormProps } from "@/types";
import { BookingDetailsTable } from "./BookingDetailsTable";

export function TravelDetailsForm({
    placeOfTour,
    setPlaceOfTour,
    frequentFlyerNo,
    setFrequentFlyerNo,
    modeOfTravel,
    setModeOfTravel,
    purpose,
    setPurpose,
    bookingDetails,
    addBookingRow,
    removeBookingRow,
    updateBookingField,
    advancePaymentRequired,
    setAdvancePaymentRequired,
    validationError,
    submitting,
    onBack,
    onSubmit,
}: TravelDetailsFormProps) {
    return (
        <Card className="bg-bgStatCard border-borderCard">
            <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-bold text-white">
                    {t("trainingEnrolment.tourApproval.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-textSidebarMuted">
                            {t("trainingEnrolment.tourApproval.placeOfTour")}
                        </Label>
                        <Input
                            value={placeOfTour}
                            onChange={(e) => setPlaceOfTour(e.target.value)}
                            className="bg-bgMain border-borderCard text-white"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-textSidebarMuted">
                            {t("trainingEnrolment.tourApproval.frequentFlyerNo")}
                        </Label>
                        <Input
                            value={frequentFlyerNo}
                            onChange={(e) => setFrequentFlyerNo(e.target.value)}
                            placeholder="e.g. 89542566"
                            className="bg-bgMain border-borderCard text-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-textSidebarMuted">
                            {t("trainingEnrolment.tourApproval.modeOfTravel")}
                        </Label>
                        <Select value={modeOfTravel} onValueChange={setModeOfTravel}>
                            <SelectTrigger className="bg-bgMain border-borderCard text-white w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-bgStatCard border-borderCard text-white">
                                <SelectItem value="flight">Flight</SelectItem>
                                <SelectItem value="train">Train</SelectItem>
                                <SelectItem value="bus">Bus</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-textSidebarMuted">
                            {t("trainingEnrolment.tourApproval.tourPurpose")}
                        </Label>
                        <Input
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="bg-bgMain border-borderCard text-white"
                        />
                    </div>
                </div>

                <BookingDetailsTable
                    modeOfTravel={modeOfTravel}
                    bookingDetails={bookingDetails}
                    addBookingRow={addBookingRow}
                    removeBookingRow={removeBookingRow}
                    updateBookingField={updateBookingField}
                />

                {/* Advance Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-textSidebarMuted">
                            {t("trainingEnrolment.advancePayment", { amount: "" })}
                        </Label>
                        <Input
                            type="number"
                            value={advancePaymentRequired || ""}
                            onChange={(e) =>
                                setAdvancePaymentRequired(Number(e.target.value))
                            }
                            placeholder="e.g. 20000"
                            className="bg-bgMain border-borderCard text-white"
                        />
                    </div>
                </div>

                {validationError && (
                    <div className="p-4 rounded-xl bg-accentRed/10 border border-accentRed/20 text-accentRed text-sm font-semibold animate-in fade-in duration-200">
                        {validationError}
                    </div>
                )}

                {/* Action buttons */}
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
                        id="step2-next-btn"
                        onClick={onSubmit}
                        disabled={submitting}
                        className="gap-2"
                    >
                        {submitting && <Loader2 className="size-4 animate-spin" />}
                        Save &amp; Continue
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
