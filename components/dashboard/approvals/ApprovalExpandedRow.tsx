'use client';

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollmentApproval, EmployeeTrainingHistoryEntry } from "@/types/enrollment";
import { getEmployeeTrainingHistoryAPI } from "@/services/enrollmentApprovalService";

interface Props {
    row: EnrollmentApproval;
    onActionClick: (row: EnrollmentApproval) => void;
}

const formatDashDate = (d?: string): string => {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    return `${day}-${month}-${date.getFullYear()}`;
};

export default function ApprovalExpandedRow({
    row,
    onActionClick,
}: Props) {
    const [history, setHistory] = useState<EmployeeTrainingHistoryEntry[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        setHistoryLoading(true);
        getEmployeeTrainingHistoryAPI(row._id)
            .then((res) => {
                if (!cancelled) setHistory(res.data ?? []);
            })
            .catch(() => {
                if (!cancelled) setHistory([]);
            })
            .finally(() => {
                if (!cancelled) setHistoryLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [row._id]);

    const venue = row.programId?.venueName || row.programId?.city || "—";
    const travelAndStay = row.travelAndStay;

    return (
        <div className="bg-[#151b23] p-6 space-y-6">

            <div className="grid grid-cols-2 gap-10 text-sm">

                <div>
                    <h4 className="font-semibold mb-4">
                        Employee Details
                    </h4>

                    <div className="space-y-2">
                        <p>
                            <span className="text-gray-400">Employee:</span>{" "}
                            {row.employeeId?.name}
                        </p>

                        <p>
                            <span className="text-gray-400">Designation:</span>{" "}
                            {row.employeeId?.designation || "—"}
                        </p>

                        <p>
                            <span className="text-gray-400">Department:</span>{" "}
                            {row.employeeId?.department || "—"}
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">
                        Training Program Details
                    </h4>

                    <div className="space-y-2">
                        <p>
                            <span className="text-gray-400">Program Title:</span>{" "}
                            {row.programId?.title}
                        </p>

                        <p>
                            <span className="text-gray-400">Start/Check-in Date:</span>{" "}
                            {formatDashDate(row.programId?.startDate)}
                        </p>

                        <p>
                            <span className="text-gray-400">End/Check-out Date:</span>{" "}
                            {formatDashDate(row.programId?.endDate)}
                        </p>

                        <p>
                            <span className="text-gray-400">Venue:</span>{" "}
                            {venue}
                        </p>

                        <p>
                            <span className="text-gray-400">Stay Type:</span>{" "}
                            {travelAndStay?.stayType || "—"}
                        </p>

                        {row.programId?.brochureUrl && (
                            <a
                                href={row.programId.brochureUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex"
                            >
                                <Button variant="outline" size="sm" className="mt-1 gap-1.5">
                                    <Download size={14} />
                                    Download Brochure
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

            </div>

            {row.notes && (
                <div>
                    <h4 className="font-semibold mb-2 text-sm">
                        Employee Recommendation
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {row.notes}
                    </p>
                </div>
            )}

            <div>
                <h4 className="font-semibold mb-3 text-sm">
                    Employee Training History
                </h4>

                {historyLoading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="text-sm text-gray-400">No prior completed trainings.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-white/10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 text-[10px] uppercase tracking-wider bg-white/5">
                                    <th className="px-3 py-2 font-semibold">Program</th>
                                    <th className="px-3 py-2 font-semibold">From</th>
                                    <th className="px-3 py-2 font-semibold">To</th>
                                    <th className="px-3 py-2 font-semibold">Provider</th>
                                    <th className="px-3 py-2 font-semibold">Venue</th>
                                    <th className="px-3 py-2 font-semibold w-10" />
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((entry) => (
                                    <tr key={entry.enrollmentId} className="border-t border-white/5">
                                        <td className="px-3 py-2">{entry.program}</td>
                                        <td className="px-3 py-2">{formatDashDate(entry.from)}</td>
                                        <td className="px-3 py-2">{formatDashDate(entry.to)}</td>
                                        <td className="px-3 py-2">{entry.trainingInstitute || "—"}</td>
                                        <td className="px-3 py-2">{entry.venue || "—"}</td>
                                        <td className="px-3 py-2">
                                            {entry.brochureUrl && (
                                                <a
                                                    href={entry.brochureUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label="Download brochure"
                                                >
                                                    <Download size={14} className="text-gray-400 hover:text-white" />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {travelAndStay && (
                <div>
                    <h4 className="font-semibold mb-3 text-sm">
                        Tour Approval Form
                    </h4>

                    <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
                        <p>
                            <span className="text-gray-400">Place of Tour:</span>{" "}
                            {travelAndStay.placeOfTour || "—"}
                        </p>
                        <p>
                            <span className="text-gray-400">Frequent Flyer No.:</span>{" "}
                            {travelAndStay.frequentFlyerNo || "—"}
                        </p>
                        <p>
                            <span className="text-gray-400">Mode of Travel:</span>{" "}
                            {travelAndStay.modeOfTravel || "—"}
                        </p>
                        <p>
                            <span className="text-gray-400">Purpose:</span>{" "}
                            {travelAndStay.purpose || "—"}
                        </p>
                        <p>
                            <span className="text-gray-400">Advance Payment Required:</span>{" "}
                            {travelAndStay.advancePaymentRequired ?? 0}
                        </p>
                        <p>
                            <span className="text-gray-400">Status:</span>{" "}
                            {travelAndStay.status || "—"}
                        </p>
                    </div>
                </div>
            )}

            {/* Action */}
            <div className="flex justify-end border-t border-border pt-4">
                <Button
                    size="sm"
                    disabled={!row.approve}
                    onClick={() => onActionClick(row)}
                >
                    Review
                </Button>
            </div>

        </div>
    );
}
