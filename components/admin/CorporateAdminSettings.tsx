"use client";

import { useEffect, useState } from "react";
import {
  getSettingsProfileApi,
  updateSettingsProfileApi,
  type UpdateSettingsProfilePayload,
} from "@/services/settings.service";

import { AppAlert } from "@/components/shared/app-alert";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/input";
import { t } from "@/lib/i18n";
import { ROLES } from "@/constants/role"; 

type CorporateAdminSettingsProps = {
  role?: string;
};

export default function CorporateAdminSettings({ role }: CorporateAdminSettingsProps) {
  const isAdmin = role === ROLES[0]; 

  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<"load" | "update" | "">("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        setError("");
        const data = await getSettingsProfileApi();
        if (!active) return;

        setGstNumber(data?.gstNumber ?? "");
        setPanNumber(data?.panNumber ?? "");
      } catch {
        if (active) setError("load");
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchProfile();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin || saving) return;

    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      const payload: UpdateSettingsProfilePayload = {
        gstNumber: gstNumber.trim().toUpperCase(),
        panNumber: panNumber.trim().toUpperCase(),
      };

      const updatedProfile = await updateSettingsProfileApi(payload);

      setGstNumber(updatedProfile.gstNumber ?? "");
      setPanNumber(updatedProfile.panNumber ?? "");

      setSuccess(true);
    } catch {
      setError("update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6">
      <section className="w-full max-w-2xl overflow-hidden rounded-2xl border border-borderCard bg-bgCard shadow-glow">
        <div className="border-b border-borderDark bg-bgStatCard px-6 py-7 sm:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {t("settings.corporateAdmin.title")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-textMuted">
            {t("settings.corporateAdmin.description")}
          </p>
        </div>

        <div className="space-y-5 px-6 py-7 sm:px-8">
          {/* Non-admin permission notice */}
          {!isAdmin && !loading && (
            <AppAlert
              title={t("settings.corporateAdmin.permissionTitle") || "View Only Mode"}
              description={t("settings.corporateAdmin.permissionMessage") || "You do not have permission to modify corporate settings. Please contact your administrator for assistance."}
              variant="destructive"
            />
          )}

          {error === "load" && (
            <AppAlert
              title={t("settings.corporateAdmin.loadErrorTitle")}
              description={t("settings.corporateAdmin.loadError")}
              variant="destructive"
            />
          )}

          {error === "update" && (
            <AppAlert
              title={t("settings.corporateAdmin.updateErrorTitle")}
              description={t("settings.corporateAdmin.updateError")}
              variant="destructive"
            />
          )}

          {success && (
            <AppAlert
              title={t("settings.corporateAdmin.successTitle")}
              description={t("settings.corporateAdmin.successMessage")}
              variant="success"
            />
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-12" role="status">
              <span className="size-5 animate-spin rounded-full border-2 border-borderDark border-t-primary" />
              <p className="text-sm font-medium text-textMuted">
                {t("settings.corporateAdmin.loading")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                id="corporate-gst"
                name="gstNumber"
                label={t("settings.corporateAdmin.gstNumber")}
                value={gstNumber}
                disabled={!isAdmin}
                onChange={(event) => {
                  setGstNumber(event.target.value.toUpperCase());
                  setSuccess(false);
                }}
                maxLength={15}
                autoComplete="off"
                placeholder={t("settings.corporateAdmin.gstPlaceholder")}
              />

              <InputField
                id="corporate-pan"
                name="panNumber"
                label={t("settings.corporateAdmin.panNumber")}
                value={panNumber}
                disabled={!isAdmin}
                onChange={(event) => {
                  setPanNumber(event.target.value.toUpperCase());
                  setSuccess(false);
                }}
                maxLength={10}
                autoComplete="off"
                placeholder={t("settings.corporateAdmin.panPlaceholder")}
              />

              {/* Hide submit button or disable it entirely for non-admins */}
              {isAdmin && (
                <div className="flex justify-end border-t border-borderDark pt-5">
                  <Button
                    type="submit"
                    disabled={saving || loading}
                    className="h-10 rounded-lg bg-primary px-6 font-semibold text-white shadow-glow transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    {saving
                      ? t("settings.corporateAdmin.saving")
                      : t("settings.corporateAdmin.saveChanges")}
                  </Button>
                </div>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}