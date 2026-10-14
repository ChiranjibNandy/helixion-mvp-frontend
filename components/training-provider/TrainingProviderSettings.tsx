"use client";

import SettingsProfileView from "../shared/settings-profile-view";

export default function TrainingProviderSettings() {
  return (
    <SettingsProfileView
      title="Training Provider Settings"
      description="Manage your account credentials and tax identifiers."
      showOrgDetails={false}
      isEditable={true}
    />
  );
}