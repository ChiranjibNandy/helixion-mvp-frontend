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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { t } from "@/lib/i18n";

import { BookingRow, TravelDetailsFormProps } from "@/types";

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

                {/* Booking Details table */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">
                            {t("trainingEnrolment.bookingDetails.title")}
                        </h3>
                        <button
                            type="button"
                            id="add-route-btn"
                            onClick={addBookingRow}
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            <Plus className="size-4" />
                            Add Route
                        </button>
                    </div>

                    <div className="rounded-xl border border-borderCard overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-borderCard hover:bg-transparent">
                                    <TableHead className="text-xs text-textSidebarMuted py-3 font-medium">
                                        {t("trainingEnrolment.bookingDetails.columns.from")}
                                    </TableHead>
                                    <TableHead className="text-xs text-textSidebarMuted py-3 font-medium">
                                        {t("trainingEnrolment.bookingDetails.columns.to")}
                                    </TableHead>
                                    <TableHead className="text-xs text-textSidebarMuted py-3 font-medium">
                                        {t("trainingEnrolment.bookingDetails.columns.flightNo")}
                                    </TableHead>
                                    <TableHead className="text-xs text-textSidebarMuted py-3 font-medium">
                                        {t("trainingEnrolment.bookingDetails.columns.departureTime")}
                                    </TableHead>
                                    <TableHead className="text-xs text-textSidebarMuted py-3 font-medium">
                                        {t("trainingEnrolment.bookingDetails.columns.dateOfTravel")}
                                    </TableHead>
                                    <TableHead className="text-xs text-textSidebarMuted py-3 font-medium">
                                        {t("trainingEnrolment.bookingDetails.columns.travelClass")}
                                    </TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookingDetails.length === 0 ? (
                                    <TableRow className="border-borderCard hover:bg-transparent">
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-xs text-textSidebarMuted py-6"
                                        >
                                            No travel routes added yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bookingDetails.map((row, idx) => (
                                        <TableRow
                                            key={idx}
                                            className="border-borderCard hover:bg-white/5"
                                        >
                                            <TableCell className="py-2">
                                                <input
                                                    value={row.from}
                                                    onChange={(e) =>
                                                        updateBookingField(idx, "from", e.target.value)
                                                    }
                                                    placeholder="City"
                                                    className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                                />
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <input
                                                    value={row.to}
                                                    onChange={(e) =>
                                                        updateBookingField(idx, "to", e.target.value)
                                                    }
                                                    placeholder="City"
                                                    className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                                />
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <input
                                                    value={row.refNo}
                                                    onChange={(e) =>
                                                        updateBookingField(idx, "refNo", e.target.value)
                                                    }
                                                    placeholder="6E246"
                                                    className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                                />
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <input
                                                    value={row.departureTime}
                                                    onChange={(e) =>
                                                        updateBookingField(idx, "departureTime", e.target.value)
                                                    }
                                                    placeholder="12:00 PM"
                                                    className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                                />
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <input
                                                    type="date"
                                                    value={row.travelDate}
                                                    onChange={(e) =>
                                                        updateBookingField(idx, "travelDate", e.target.value)
                                                    }
                                                    className="bg-transparent text-sm font-semibold text-white outline-none [color-scheme:dark]"
                                                />
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <input
                                                    value={row.travelClass}
                                                    onChange={(e) =>
                                                        updateBookingField(idx, "travelClass", e.target.value)
                                                    }
                                                    placeholder="Economy"
                                                    className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                                />
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeBookingRow(idx)}
                                                    className="text-accentRed hover:text-accentRed/80 transition-colors p-1"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

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
