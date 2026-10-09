import CorporateAdminSettings from "@/components/admin/CorporateAdminSettings";
import TrainingProviderSettings from "@/components/training-provider/TrainingProviderSettings";
import { ROLES } from "@/constants/role";
import { decodeJwtPayload, getAccessToken } from "@/utils/token";
import { redirect } from "next/navigation";

export default async function Settings() {
   const token = await getAccessToken();
   if (!token) redirect('/signin');

   const payload = await decodeJwtPayload(token);
   const role = payload.orgRole;

   return (
      role === ROLES[3] ? <TrainingProviderSettings /> : <CorporateAdminSettings role={role} />
   );
}