
"use client";

import CorporateAdminSettings from "@/components/admin/CorporateAdminSettings";
import { ROLES } from "@/constants/role";

export default function AdminSettings() {
   return (
      <CorporateAdminSettings role={ROLES[0]} />
   );
}
