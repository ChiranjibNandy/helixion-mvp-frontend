"use client";

import { t } from "@/lib/i18n";
import SettingsProfileView from "../shared/settings-profile-view";

export default function TrainingProviderSettings() {
  return (
    <SettingsProfileView
      title={t("settings.trainingProvider.title")}
      description={t("settings.trainingProvider.description")}
      showOrgDetails={false}
      isEditable={true}
    />
  );
}