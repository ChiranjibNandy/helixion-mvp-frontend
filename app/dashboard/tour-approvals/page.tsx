import { getAccessToken, decodeJwtPayload } from "@/utils/token";
import { redirect } from "next/navigation";
import TourApprovalsClient from "./TourApprovalsClient";

export default async function TourApprovalsPage() {
   const token = await getAccessToken();
   if (!token) redirect("/signin");

   const payload = await decodeJwtPayload(token);
   const permissions = payload.permissions || {};

   // Determine if OSD or Manager
   const isOsd = permissions.canReviewOsd || permissions.canApproveOsd;
   const roleType = isOsd ? "osd" : "manager";

   return <TourApprovalsClient roleType={roleType} />;
}
