import { Button } from "@/components/ui/button";
import { EnrollmentApproval } from "@/types/enrollment";

interface Props {
    row: EnrollmentApproval;
}

export default function ApprovalExpandedRow({
    row,
}: Props) {
    return (
        <div className="bg-[#151b23] p-6">

            <div className="grid grid-cols-2 gap-10 text-sm">

                <div>
                    <h4 className="font-semibold mb-4">
                        Employee Details
                    </h4>

                    <div className="space-y-2">
                        <p>
                            <span className="text-gray-400">Employee :</span>{" "}
                            {row.employeeId.name}
                        </p>

                        <p>
                            <span className="text-gray-400">Purpose :</span>{" "}
                            {row.travelAndStay.purpose}
                        </p>

                        <p>
                            <span className="text-gray-400">Stay :</span>{" "}
                            {row.stayType}
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">
                        Training Details
                    </h4>

                    <div className="space-y-2">
                        <p>
                            <span className="text-gray-400">Program :</span>{" "}
                            {row.programSnapshot.title}
                        </p>

                        <p>
                            <span className="text-gray-400">Venue :</span>{" "}
                            {row.programSnapshot.venue}
                        </p>

                        <p>
                            <span className="text-gray-400">Current Stage :</span>{" "}
                            {row.currentStage}
                        </p>
                    </div>
                </div>

            </div>

            {/* Action */}
            <div className="mt-6 flex justify-end border-t border-border pt-4">
                <Button
                    size="sm"
                    disabled={!row.approve}
                >
                    Approve
                </Button>
            </div>

        </div>
    );
}