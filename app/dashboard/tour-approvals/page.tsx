import { getAccessToken, decodeJwtPayload } from "@/utils/token";
import { redirect } from "next/navigation";
import TourApprovalsClient from "./TourApprovalsClient";

export default async function TourApprovalsPage() {
   const token = await getAccessToken();
   if (!token) redirect("/signin");

   const payload = await decodeJwtPayload(token);
   const permissions = payload.permissions || {};

   // Determine if CTD or Manager. Falls back to canApproveTrainingDept for
   // JWTs issued before canApproveTourCtd existed — that field is a strict
   // superset of canApproveTourCtd's check (same level-2 gate, plus the
   // trainingDeptApproval.enabled requirement), so this never grants tour
   // access to a non-CTD user, it just avoids misrouting an already-logged-in
   // CTD officer to the Manager view until their token naturally refreshes.
   const isCtd = permissions.canApproveTourCtd ?? permissions.canApproveTrainingDept;
   const roleType = isCtd ? "ctd" : "manager";

   return <TourApprovalsClient roleType={roleType} />;
}
