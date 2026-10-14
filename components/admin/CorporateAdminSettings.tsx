"use client";

import { USER_ROLES } from "@/constants/navigation";
import { t } from "@/lib/i18n";
import SettingsProfileView from "../shared/settings-profile-view";

type CorporateAdminSettingsProps = {
  role?: string;
};

export default function CorporateAdminSettings({ role }: CorporateAdminSettingsProps) {
  const isAdmin = role === USER_ROLES.ADMIN;

  return (
    <SettingsProfileView
      title={t("settings.corporateAdmin.title")}
      description={t("settings.corporateAdmin.description")}
      showOrgDetails={true}
      isEditable={isAdmin}
      permissionWarning={
        !isAdmin
          ? {
              title: t("settings.corporateAdmin.permissionTitle"),
              message: t("settings.corporateAdmin.permissionMessage"),
            }
          : undefined
      }
    />
  );
}