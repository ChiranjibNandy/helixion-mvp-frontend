"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { t } from "@/lib/i18n";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BookingRow } from "@/types";

interface BookingDetailsTableProps {
    modeOfTravel: string;
    bookingDetails: BookingRow[];
    addBookingRow: () => void;
    removeBookingRow: (id: string) => void;
    updateBookingField: (id: string, field: keyof Omit<BookingRow, "id">, value: string) => void;
}

export function BookingDetailsTable({
    modeOfTravel,
    bookingDetails,
    addBookingRow,
    removeBookingRow,
    updateBookingField,
}: BookingDetailsTableProps) {
    const showFlightSpecificColumns = modeOfTravel === "flight";
    const baseColumnCount = 5;
    const totalColumns = showFlightSpecificColumns ? baseColumnCount + 2 : baseColumnCount;

    return (
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
                            {showFlightSpecificColumns && (
                                <>
                                    <TableHead className="text-xs text-textSidebarMuted py-3 font-medium">
                                        {t("trainingEnrolment.bookingDetails.columns.flightNo")}
                                    </TableHead>
                                    <TableHead className="text-xs text-textSidebarMuted py-3 font-medium">
                                        {t("trainingEnrolment.bookingDetails.columns.departureTime")}
                                    </TableHead>
                                </>
                            )}
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
                                    colSpan={totalColumns}
                                    className="text-center text-xs text-textSidebarMuted py-6"
                                >
                                    No travel routes added yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookingDetails.map((row) => (
                                <TableRow key={row.id} className="border-borderCard hover:bg-white/5">
                                    <TableCell className="py-2">
                                        <input
                                            value={row.from}
                                            onChange={(e) => updateBookingField(row.id, "from", e.target.value)}
                                            placeholder="City"
                                            className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                        />
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <input
                                            value={row.to}
                                            onChange={(e) => updateBookingField(row.id, "to", e.target.value)}
                                            placeholder="City"
                                            className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                        />
                                    </TableCell>
                                    {showFlightSpecificColumns && (
                                        <>
                                            <TableCell className="py-2">
                                                <input
                                                    value={row.refNo}
                                                    onChange={(e) => updateBookingField(row.id, "refNo", e.target.value)}
                                                    placeholder="6E246"
                                                    className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                                />
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <input
                                                    value={row.departureTime}
                                                    onChange={(e) =>
                                                        updateBookingField(row.id, "departureTime", e.target.value)
                                                    }
                                                    placeholder="12:00 PM"
                                                    className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                                />
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell className="py-2">
                                        <input
                                            type="date"
                                            value={row.travelDate}
                                            onChange={(e) => updateBookingField(row.id, "travelDate", e.target.value)}
                                            className="bg-transparent text-sm font-semibold text-white outline-none [color-scheme:dark]"
                                        />
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <input
                                            value={row.travelClass}
                                            onChange={(e) => updateBookingField(row.id, "travelClass", e.target.value)}
                                            placeholder="Economy"
                                            className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-textSidebarMuted/50"
                                        />
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <button
                                            type="button"
                                            onClick={() => removeBookingRow(row.id)}
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
    );
}
