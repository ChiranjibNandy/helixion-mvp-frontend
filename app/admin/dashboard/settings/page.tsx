
"use client";

import CorporateAdminSettings from "@/components/admin/CorporateAdminSettings";
import { USER_ROLES } from "@/constants/navigation";


export default function AdminSettings() {
   return (
      <CorporateAdminSettings role={USER_ROLES.ADMIN} />
   );
}
