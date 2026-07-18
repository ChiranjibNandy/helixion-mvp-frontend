'use client';

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/data-table";
import { EnrollmentApproval, EmployeeTrainingHistoryEntry } from "@/types/enrollment";
import { getEmployeeTrainingHistoryAPI } from "@/services/enrollmentApprovalService";
import { t } from "@/lib/i18n";

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

    const historyColumns = [
        {
            header: t("managerApprovals.historyColumns.program"),
            render: (entry: EmployeeTrainingHistoryEntry) => entry.program,
        },
        {
            header: t("managerApprovals.historyColumns.from"),
            render: (entry: EmployeeTrainingHistoryEntry) => formatDashDate(entry.from),
        },
        {
            header: t("managerApprovals.historyColumns.to"),
            render: (entry: EmployeeTrainingHistoryEntry) => formatDashDate(entry.to),
        },
        {
            header: t("managerApprovals.historyColumns.provider"),
            render: (entry: EmployeeTrainingHistoryEntry) => entry.trainingInstitute || "—",
        },
        {
            header: t("managerApprovals.historyColumns.venue"),
            render: (entry: EmployeeTrainingHistoryEntry) => entry.venue || "—",
        },
        {
            header: "",
            className: "w-10",
            render: (entry: EmployeeTrainingHistoryEntry) =>
                entry.brochureUrl && (
                    <a
                        href={entry.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download brochure"
                    >
                        <Download size={14} className="text-gray-400 hover:text-white" />
                    </a>
                ),
        },
    ];

    return (
        <div className="bg-[#151b23] p-6 space-y-6">

            <div className="grid grid-cols-2 gap-10 text-sm">

                <div>
                    <h4 className="font-semibold mb-4">
                        {t("managerApprovals.detail.employeeDetails")}
                    </h4>

                    <div className="space-y-2">
                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.employee")}:</span>{" "}
                            {row.employeeId?.name}
                        </p>

                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.designation")}:</span>{" "}
                            {row.employeeId?.designation || "—"}
                        </p>

                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.department")}:</span>{" "}
                            {row.employeeId?.department || "—"}
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">
                        {t("managerApprovals.detail.trainingProgramDetails")}
                    </h4>

                    <div className="space-y-2">
                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.programTitle")}:</span>{" "}
                            {row.programId?.title}
                        </p>

                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.startDate")}:</span>{" "}
                            {formatDashDate(row.programId?.startDate)}
                        </p>

                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.endDate")}:</span>{" "}
                            {formatDashDate(row.programId?.endDate)}
                        </p>

                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.venue")}:</span>{" "}
                            {venue}
                        </p>

                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.stayType")}:</span>{" "}
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
                                    {t("managerApprovals.detail.downloadBrochure")}
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

            </div>

            {row.notes && (
                <div>
                    <h4 className="font-semibold mb-2 text-sm">
                        {t("managerApprovals.detail.employeeRecommendation")}
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {row.notes}
                    </p>
                </div>
            )}

            <div>
                <h4 className="font-semibold mb-3 text-sm">
                    {t("managerApprovals.detail.employeeTrainingHistory")}
                </h4>

                <DataTable
                    data={history}
                    columns={historyColumns}
                    loading={historyLoading}
                    rowKey={(entry: EmployeeTrainingHistoryEntry) => entry.enrollmentId}
                    emptyMessage={t("managerApprovals.detail.noHistory")}
                />
            </div>

            {travelAndStay && (
                <div>
                    <h4 className="font-semibold mb-3 text-sm">
                        {t("managerApprovals.detail.tourApprovalForm")}
                    </h4>

                    <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.placeOfTour")}:</span>{" "}
                            {travelAndStay.placeOfTour || "—"}
                        </p>
                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.frequentFlyerNo")}:</span>{" "}
                            {travelAndStay.frequentFlyerNo || "—"}
                        </p>
                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.modeOfTravel")}:</span>{" "}
                            {travelAndStay.modeOfTravel || "—"}
                        </p>
                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.purpose")}:</span>{" "}
                            {travelAndStay.purpose || "—"}
                        </p>
                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.advancePaymentRequired")}:</span>{" "}
                            {travelAndStay.advancePaymentRequired ?? 0}
                        </p>
                        <p>
                            <span className="text-gray-400">{t("managerApprovals.detail.status")}:</span>{" "}
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
                    {t("managerApprovals.detail.review")}
                </Button>
            </div>

        </div>
    );
}
