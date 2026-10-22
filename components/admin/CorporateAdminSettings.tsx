"use client";

import { t } from "@/lib/i18n";
import SettingsProfileView from "../shared/settings-profile-view";


export default function CorporateAdminSettings() {
  return (
    <SettingsProfileView
      title={t("settings.corporateAdmin.title")}
      description={t("settings.corporateAdmin.description")}
      showOrgDetails={true}
      isEditable={true}
    />
  );
}