"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ApprovalStatusBadge from "@/components/shared/ApprovalStatusBadge";
import DataTable from "@/components/shared/data-table";
import ConfirmApprovalModal from "@/components/dashboard/approvals/ConfirmApprovalModal";
import ApprovalExpandedRow from "@/components/dashboard/approvals/ApprovalExpandedRow";
import { useTourApprovals } from "@/hooks/useTourApprovals";
import { formatDate } from "@/utils/formatters";
import { AppAlert } from "@/components/shared/app-alert";
import { EnrollmentApproval } from "@/types/enrollment";
import { takeTourManagerActionAPI, takeOsdTourActionAPI } from "@/services/enrollmentApprovalService";

interface TourApprovalsClientProps {
    roleType: "manager" | "osd";
}

export default function TourApprovalsClient({ roleType }: TourApprovalsClientProps) {
    const { data, loading, error, refresh } = useTourApprovals(roleType);

    const [expanded, setExpanded] = useState<string | null>(null);
    const [actionRow, setActionRow] = useState<EnrollmentApproval | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const closeModal = () => {
        if (actionLoading) return;
        setActionRow(null);
        setActionError(null);
    };

    const handleAction = async (action: "approve" | "reject") => {
        if (!actionRow) return;

        setActionLoading(true);
        setActionError(null);

        try {
            if (roleType === "manager") {
                await takeTourManagerActionAPI(actionRow._id, action);
            } else {
                await takeOsdTourActionAPI(actionRow._id, action);
            }
            setActionRow(null);
            refresh();
        } catch (err: any) {
            setActionError(
                err?.response?.data?.message || err?.message || "Something went wrong"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        {
            header: "Employee Name",
            render: (row: EnrollmentApproval) => (
                <div className="font-medium">
                    {row.employeeId?.name || "Unknown"}
                </div>
            ),
        },
        {
            header: "Program Title",
            render: (row: EnrollmentApproval) => row.programId?.title || "-",
        },
        {
            header: "Travel Date",
            render: (row: EnrollmentApproval) => {
                const dates = row.tour?.bookingDetails?.map((b: any) => b.travelDate).filter(Boolean);
                if (dates && dates.length > 0) return formatDate(dates[0]);
                return "-";
            },
        },
        {
            header: "Place of Tour",
            render: (row: EnrollmentApproval) => row.tour?.placeOfTour || row.programId?.venueName || row.programId?.city || "-",
        },
        {
            header: "Status",
            render: (row: EnrollmentApproval) => (
                <ApprovalStatusBadge status={row.tour?.status || "pending"} />
            ),
        },
        {
            header: "",
            className: "w-10",
            render: (row: EnrollmentApproval) =>
                expanded === row._id ? (
                    <ChevronUp size={16} />
                ) : (
                    <ChevronDown size={16} />
                ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">
                    {roleType === "osd" ? "OSD Tour Approvals" : "Manager Tour Approvals"}
                </h1>
                <p className="text-gray-400 text-sm">
                    Review and approve tour requests submitted by employees.
                </p>
            </div>

            {error && (
                <div className="mb-4">
                    <AppAlert
                        variant="destructive"
                        title="Error"
                        description={error}
                    />
                </div>
            )}

            <DataTable
                data={data}
                columns={columns}
                loading={loading}
                rowKey={(row: EnrollmentApproval) => row._id}
                onRowClick={(row: EnrollmentApproval) =>
                    setExpanded(expanded === row._id ? null : row._id)
                }
                isRowExpanded={(row: EnrollmentApproval) => expanded === row._id}
                renderExpandedRow={(row: EnrollmentApproval) => (
                    <div className="p-6 bg-white/5 border-b border-borderCard">
                        {/* Summary of Tour Details */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-white mb-2">Tour Details</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70">
                                <div>
                                    <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">Place of Tour</span>
                                    {row.tour?.placeOfTour || "-"}
                                </div>
                                <div>
                                    <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">Mode of Travel</span>
                                    {row.tour?.modeOfTravel || "-"}
                                </div>
                                <div>
                                    <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">Purpose</span>
                                    {row.tour?.purpose || "-"}
                                </div>
                                <div>
                                    <span className="block text-white/50 text-xs uppercase tracking-wider mb-1">Advance Payment</span>
                                    {row.tour?.advancePaymentRequired ? `$${row.tour.advancePaymentRequired}` : "None"}
                                </div>
                            </div>
                        </div>

                        {/* Booking Details Table if exists */}
                        {row.tour?.bookingDetails && row.tour.bookingDetails.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-white mb-2">Bookings</h4>
                                <div className="border border-borderCard rounded overflow-hidden">
                                    <table className="w-full text-left text-sm text-white/70">
                                        <thead className="bg-bgMain text-white/50 border-b border-borderCard">
                                            <tr>
                                                <th className="p-2 font-medium">Date</th>
                                                <th className="p-2 font-medium">From</th>
                                                <th className="p-2 font-medium">To</th>
                                                <th className="p-2 font-medium">Ref No.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {row.tour.bookingDetails.map((b: any, i: number) => (
                                                <tr key={i} className="border-b border-borderCard last:border-0 hover:bg-white/5">
                                                    <td className="p-2">{formatDate(b.travelDate)}</td>
                                                    <td className="p-2">{b.from}</td>
                                                    <td className="p-2">{b.to}</td>
                                                    <td className="p-2">{b.refNo}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-borderCard">
                            <button
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium"
                                onClick={(e) => { e.stopPropagation(); setActionRow(row); }}
                            >
                                Take Action
                            </button>
                        </div>
                    </div>
                )}
            />

            <ConfirmApprovalModal
                isOpen={Boolean(actionRow)}
                row={actionRow}
                loading={actionLoading}
                error={actionError}
                onApprove={() => handleAction("approve")}
                onReject={() => handleAction("reject")}
                onCancel={closeModal}
            />
        </div>
    );
}
