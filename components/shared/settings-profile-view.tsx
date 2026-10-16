"use client";

import { useEffect, useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import {
   getSettingsProfileApi,
   updateSettingsProfileApi,
   type UpdateSettingsProfilePayload,
   type SettingsProfile,
   Address,
} from "@/services/settings.service";
import { formatAddressString } from "@/utils/address";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { t } from "@/lib/i18n";
import { validateSettings } from "@/validations/settings";
import InputField from "@/components/ui/input";
import AppModal from "@/components/ui/app-modal";

type SettingsProfileViewProps = {
   title: string;
   description: string;
   showOrgDetails?: boolean;
   isEditable?: boolean;
   permissionWarning?: {
      title: string;
      message: string;
   };
};

type FieldState = {
   mode: "view" | "edit";
   revealed: boolean;
   draft: string;
   error: string;
};

type LocationFieldState = {
   mode: "view" | "draft:edit" | "edit";
   draft: Address;
   error: string;
};

const INITIAL_ADDRESS: Address = {
   addressLine1: "",
   addressLine2: "",
   city: "",
   state: "",
   postalCode: "",
};

export default function SettingsProfileView({
   title,
   description,
   showOrgDetails = true,
   isEditable = true,
}: SettingsProfileViewProps) {
   const [profile, setProfile] = useState<SettingsProfile | null>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);

   const [panState, setPanState] = useState<FieldState>({
      mode: "view",
      revealed: false,
      draft: "",
      error: "",
   });

   const [gstState, setGstState] = useState<FieldState>({
      mode: "view",
      revealed: false,
      draft: "",
      error: "",
   });

   const [locationState, setLocationState] = useState<LocationFieldState>({
      mode: "view",
      draft: INITIAL_ADDRESS,
      error: "",
   });

   const [pendingSave, setPendingSave] = useState<{
      key: "pan" | "gst" | "location";
      value: string | Address;
   } | null>(null);

   const panTimerRef = useRef<NodeJS.Timeout | null>(null);
   const gstTimerRef = useRef<NodeJS.Timeout | null>(null);

   const fetchProfile = async (isActiveCheck?: () => boolean) => {
      try {
         const data = await getSettingsProfileApi();
         if (isActiveCheck && !isActiveCheck()) return;
         setProfile(data);
      } catch {
         if (!isActiveCheck || isActiveCheck()) {
            toast.error(t("settings.corporateAdmin.loadErrorTitle"), {
               description: t("settings.corporateAdmin.loadError"),
            });
         }
      } finally {
         if (!isActiveCheck || isActiveCheck()) {
            setLoading(false);
         }
      }
   };

   useEffect(() => {
      let active = true;
      const checkActive = () => active;

      void fetchProfile(checkActive);

      return () => {
         active = false;
         if (panTimerRef.current) clearTimeout(panTimerRef.current);
         if (gstTimerRef.current) clearTimeout(gstTimerRef.current);
      };
   }, []);

   const toggleRevealPan = () => {
      setPanState((prev) => {
         const nextRevealed = !prev.revealed;
         if (panTimerRef.current) clearTimeout(panTimerRef.current);
         if (nextRevealed) {
            panTimerRef.current = setTimeout(() => {
               setPanState((s) => ({ ...s, revealed: false }));
            }, 30000);
         }
         return { ...prev, revealed: nextRevealed };
      });
   };

   const toggleRevealGst = () => {
      setGstState((prev) => {
         const nextRevealed = !prev.revealed;
         if (gstTimerRef.current) clearTimeout(gstTimerRef.current);
         if (nextRevealed) {
            gstTimerRef.current = setTimeout(() => {
               setGstState((s) => ({ ...s, revealed: false }));
            }, 30000);
         }
         return { ...prev, revealed: nextRevealed };
      });
   };

   const handleTrySave = (key: "pan" | "gst") => {
      const isPan = key === "pan";
      const currentValue = isPan ? panState.draft : gstState.draft;
      const cleanValue = currentValue.trim().toUpperCase();

      const currentPan = isPan ? cleanValue : profile?.panNumber || "";
      const currentGst = isPan ? profile?.gstNumber || "" : cleanValue;

      const validationMsg = validateSettings(currentGst, currentPan);

      if (validationMsg) {
         if (isPan) {
            setPanState((prev) => ({ ...prev, error: validationMsg }));
         } else {
            setGstState((prev) => ({ ...prev, error: validationMsg }));
         }
         return;
      }

      setPendingSave({ key, value: cleanValue });
   };

   const handleTrySaveLocation = () => {
      const { addressLine1, city, state, postalCode } = locationState.draft;
      if (!addressLine1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
         setLocationState((prev) => ({
            ...prev,
            error: t("settings.location.validationError"),
         }));
         return;
      }
      setPendingSave({ key: "location", value: locationState.draft });
   };

   const handleConfirmSave = async () => {
      if (!pendingSave || saving) return;

      const { key, value } = pendingSave;
      setSaving(true);

      const payload: UpdateSettingsProfilePayload = {
         ...(key === "pan" ? { panNumber: value as string } : {}),
         ...(key === "gst" ? { gstNumber: value as string } : {}),
         ...(key === "location" ? { location: value as Address } : {}),
      };

      try {
         const updatedProfile = await updateSettingsProfileApi(payload);
         setProfile(updatedProfile);

         if (key === "pan") setPanState({ mode: "view", revealed: false, draft: "", error: "" });
         if (key === "gst") setGstState({ mode: "view", revealed: false, draft: "", error: "" });
         if (key === "location") setLocationState({ mode: "view", draft: INITIAL_ADDRESS, error: "" });

         // Fixed: Directly invoke toast.success without redundant truthy check
         toast.success(t("settings.corporateAdmin.successTitle"), {
            description: t("settings.corporateAdmin.successMessage"),
         });
      } catch {
         toast.error(t("settings.corporateAdmin.updateErrorTitle"), {
            description: t("settings.corporateAdmin.updateError"),
         });
      } finally {
         setSaving(false);
         setPendingSave(null);
         void fetchProfile();
      }
   };

   const maskValue = (val?: string) => {
      if (!val) return "";
      return "•".repeat(val.length);
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center gap-3 py-24" role="status">
            <Spinner size="md" />
            <p className="text-sm font-medium text-slate-400">
               {t("settings.corporateAdmin.loading")}
            </p>
         </div>
      );
   }

   const isLocationModal = pendingSave?.key === "location";
   const taxKeyLabel = pendingSave?.key ? pendingSave.key.toUpperCase() : "";

   return (
      <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 text-slate-100">
         {/* Header */}
         <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">{title}</h1>
               <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
         </div>
         {/* Company/Account Profile Card */}
         <Card>
            <CardHeader className="flex flex-row items-start justify-between">
               <div>
                  <CardTitle>{showOrgDetails ? t("settings.companyProfile.title") : t("settings.accountInfo.title")}</CardTitle>
                  <CardDescription className="mt-1">
                     {showOrgDetails
                        ? t("settings.companyProfile.description")
                        : t("settings.accountInfo.description")}
                  </CardDescription>
               </div>
               <span className="rounded-full border border-slate-700 bg-slate-800/50 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                  {t("settings.badges.readOnly")}
               </span>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                  {showOrgDetails && (
                     <>
                        <div className="rounded-lg border border-slate-800 bg-black/30 p-3">
                           <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("settings.fields.legalName")}</div>
                           <div className="mt-1 text-sm font-medium text-slate-200">{profile?.orgName || "—"}</div>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-black/30 p-3">
                           <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("settings.fields.orgType")}</div>
                           <div className="mt-1 text-sm font-medium text-slate-200 capitalize">{profile?.orgType || "—"}</div>
                        </div>
                     </>
                  )}
                  <div className="rounded-lg border border-slate-800 bg-black/30 p-3">
                     <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("settings.fields.contactEmail")}</div>
                     <div className="mt-1 text-sm font-medium text-slate-200">{profile?.email || "—"}</div>
                  </div>
                  {showOrgDetails && (
                     <div className="rounded-lg border border-slate-800 bg-black/30 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("settings.fields.slug")}</div>
                        <div className="mt-1 text-sm font-medium text-slate-200">{profile?.slug || "—"}</div>
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Tax Identifiers Card */}
         <Card>
            <CardHeader className="flex flex-row items-start justify-between">
               <div>
                  <CardTitle>{t("settings.tax.title")}</CardTitle>
                  <CardDescription className="mt-1">
                     {t("settings.tax.description")}
                  </CardDescription>
               </div>
               <span className="rounded-full border border-slate-700 bg-slate-800/50 px-2.5 py-0.5 text-[10px] tracking-wider text-slate-400">
                  {isEditable ? t("settings.badges.editable") : t("settings.badges.readOnlyAccess")}
               </span>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* PAN */}
                  <div className={`min-h-[72px] rounded-lg border bg-black/30 p-3.5 transition ${ panState.error ? "border-red-500/60" : "border-slate-800 focus-within:border-blue-500/60" }`}>
                     <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <span>{t("settings.tax.panLabel")}</span>
                        {profile?.panNumber ? (
                           <span className="rounded-full border border-emerald-500/30 px-2 py-0.2 text-[9px] text-emerald-400">{t("settings.badges.onFile")}</span>
                        ) : (
                           <span className="rounded-full border border-amber-500/30 px-2 py-0.2 text-[9px] text-amber-400">{t("settings.badges.notAdded")}</span>
                        )}
                     </div>

                     {panState.mode === "edit" ? (
                        <div className="mt-2 space-y-2">
                           <InputField
                              maxLength={10}
                              value={panState.draft}
                              onChange={(e) => setPanState((s) => ({ ...s, draft: e.target.value.toUpperCase(), error: "" }))}
                              placeholder={t("settings.tax.panPlaceholder")}
                              error={panState.error}
                              autoFocus
                           />
                           <div className="text-[11px] text-slate-500">{t("settings.tax.panFormat")}</div>
                           <div className="flex justify-end gap-2 pt-1">
                              <Button type="button" variant="ghost" className="h-7 px-2.5 text-xs text-slate-400 hover:text-white" onClick={() => setPanState({ mode: "view", revealed: false, draft: "", error: "" })}>{t("settings.actions.cancel")}</Button>
                              <Button type="button" disabled={!panState.draft.trim()} className="h-7 bg-primary px-3 text-xs text-white hover:bg-blue-600" onClick={() => handleTrySave("pan")}>{t("settings.actions.save")}</Button>
                           </div>
                        </div>
                     ) : (
                        <div className="mt-2 flex items-center justify-between gap-2">
                           <div className="font-mono text-sm tracking-widest text-slate-200">
                              {profile?.panNumber ? (panState.revealed ? profile.panNumber : maskValue(profile.panNumber)) : t("settings.tax.noPan")}
                           </div>
                           <div className="flex items-center gap-1.5">
                              {profile?.panNumber && (
                                 <Button type="button" variant="outline" className="h-7 gap-1 border-blue-500/30 bg-blue-500/10 px-2.5 text-xs text-blue-300 hover:bg-blue-500/20" onClick={toggleRevealPan}>
                                    {panState.revealed ? <><EyeOff className="size-3.5" /><span>{t("settings.actions.hide")}</span></> : <><Eye className="size-3.5" /><span>{t("settings.actions.reveal")}</span></>}
                                 </Button>
                              )}
                              {isEditable && (
                                 <Button type="button" variant="outline" className="h-7 border-slate-700 bg-white/5 px-2.5 text-xs text-slate-200 hover:bg-white/10" onClick={() => setPanState({ mode: "edit", revealed: false, draft: profile?.panNumber || "", error: "" })}>
                                    {profile?.panNumber ? t("settings.actions.edit") : t("settings.actions.addPan")}
                                 </Button>
                              )}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* GSTIN */}
                  <div className={`min-h-[72px] rounded-lg border bg-black/30 p-3.5 transition ${ gstState.error ? "border-red-500/60" : "border-slate-800 focus-within:border-blue-500/60" }`}>
                     <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <span>{t("settings.tax.gstLabel")}</span>
                        {profile?.gstNumber ? (
                           <span className="rounded-full border border-emerald-500/30 px-2 py-0.2 text-[9px] text-emerald-400">{t("settings.badges.onFile")}</span>
                        ) : (
                           <span className="rounded-full border border-amber-500/30 px-2 py-0.2 text-[9px] text-amber-400">{t("settings.badges.notAdded")}</span>
                        )}
                     </div>

                     {gstState.mode === "edit" ? (
                        <div className="mt-2 space-y-2">
                           <InputField
                              maxLength={15}
                              value={gstState.draft}
                              onChange={(e) => setGstState((s) => ({ ...s, draft: e.target.value.toUpperCase(), error: "" }))}
                              placeholder={t("settings.tax.gstPlaceholder")}
                              error={gstState.error}
                              autoFocus
                           />
                           <div className="text-[11px] text-slate-500">{t("settings.tax.gstFormat")}</div>
                           <div className="flex justify-end gap-2 pt-1">
                              <Button type="button" variant="ghost" className="h-7 px-2.5 text-xs text-slate-400 hover:text-white" onClick={() => setGstState({ mode: "view", revealed: false, draft: "", error: "" })}>{t("settings.actions.cancel")}</Button>
                              <Button type="button" disabled={!gstState.draft.trim()} className="h-7 bg-primary px-3 text-xs text-white hover:bg-blue-600" onClick={() => handleTrySave("gst")}>{t("settings.actions.save")}</Button>
                           </div>
                        </div>
                     ) : (
                        <div className="mt-2 flex items-center justify-between gap-2">
                           <div className="font-mono text-sm tracking-widest text-slate-200">
                              {profile?.gstNumber ? (gstState.revealed ? profile.gstNumber : maskValue(profile.gstNumber)) : t("settings.tax.noGst")}
                           </div>
                           <div className="flex items-center gap-1.5">
                              {profile?.gstNumber && (
                                 <Button type="button" variant="outline" className="h-7 gap-1 border-blue-500/30 bg-blue-500/10 px-2.5 text-xs text-blue-300 hover:bg-blue-500/20" onClick={toggleRevealGst}>
                                    {gstState.revealed ? <><EyeOff className="size-3.5" /><span>{t("settings.actions.hide")}</span></> : <><Eye className="size-3.5" /><span>{t("settings.actions.reveal")}</span></>}
                                 </Button>
                              )}
                              {isEditable && (
                                 <Button type="button" variant="outline" className="h-7 border-slate-700 bg-white/5 px-2.5 text-xs text-slate-200 hover:bg-white/10" onClick={() => setGstState({ mode: "edit", revealed: false, draft: profile?.gstNumber || "", error: "" })}>
                                    {profile?.gstNumber ? t("settings.actions.edit") : t("settings.actions.addGst")}
                                 </Button>
                              )}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
               <div className="mt-4 flex flex-wrap justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-500">
                  <span>{t("settings.tax.auditNotice")}</span>
                  <span>{t("settings.tax.securityActive")}</span>
               </div>
            </CardContent>
         </Card>

         {/* Location / Address Card */}
         <Card>
            <CardHeader className="flex flex-row items-start justify-between">
               <div>
                  <CardTitle>{t("settings.location.title")}</CardTitle>
                  <CardDescription className="mt-1">
                     {t("settings.location.description")}
                  </CardDescription>
               </div>
               <span className="rounded-full border border-slate-700 bg-slate-800/50 px-2.5 py-0.5 text-[10px] tracking-wider text-slate-400">
                  {isEditable ? t("settings.badges.editable") : t("settings.badges.readOnlyAccess")}
               </span>
            </CardHeader>
            <CardContent>
               <div className={`rounded-lg border bg-black/30 p-4 transition ${ locationState.error ? "border-red-500/60" : "border-slate-800" }`}>
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                     <span>{t("settings.location.registeredAddress")}</span>
                     {profile?.location ? (
                        <span className="rounded-full border border-emerald-500/30 px-2 py-0.2 text-[9px] text-emerald-400">{t("settings.badges.onFile")}</span>
                     ) : (
                        <span className="rounded-full border border-amber-500/30 px-2 py-0.2 text-[9px] text-amber-400">{t("settings.badges.notAdded")}</span>
                     )}
                  </div>

                  {locationState.mode === "edit" ? (
                     <div className="space-y-3 mt-3">
                        <InputField
                           label={t("settings.location.addressLine1Label")}
                           value={locationState.draft.addressLine1}
                           onChange={(e) => setLocationState((s) => ({ ...s, draft: { ...s.draft, addressLine1: e.target.value }, error: "" }))}
                           placeholder={t("settings.location.addressLine1Placeholder")}
                           required
                        />
                        <InputField
                           label={t("settings.location.addressLine2Label")}
                           value={locationState.draft.addressLine2 || ""}
                           onChange={(e) => setLocationState((s) => ({ ...s, draft: { ...s.draft, addressLine2: e.target.value }, error: "" }))}
                           placeholder={t("settings.location.addressLine2Placeholder")}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           <InputField
                              label={t("settings.location.cityLabel")}
                              value={locationState.draft.city}
                              onChange={(e) => setLocationState((s) => ({ ...s, draft: { ...s.draft, city: e.target.value }, error: "" }))}
                              placeholder={t("settings.location.cityPlaceholder")}
                              required
                           />
                           <InputField
                              label={t("settings.location.stateLabel")}
                              value={locationState.draft.state}
                              onChange={(e) => setLocationState((s) => ({ ...s, draft: { ...s.draft, state: e.target.value }, error: "" }))}
                              placeholder={t("settings.location.statePlaceholder")}
                              required
                           />
                        </div>
                        <InputField
                           label={t("settings.location.postalCodeLabel")}
                           value={locationState.draft.postalCode}
                           onChange={(e) => setLocationState((s) => ({ ...s, draft: { ...s.draft, postalCode: e.target.value }, error: "" }))}
                           placeholder={t("settings.location.postalCodePlaceholder")}
                           required
                        />
                        {locationState.error && <p className="text-xs text-red-400">{locationState.error}</p>}
                        <div className="flex justify-end gap-2 pt-2">
                           <Button type="button" variant="ghost" className="h-7 px-2.5 text-xs text-slate-400 hover:text-white" onClick={() => setLocationState({ mode: "view", draft: INITIAL_ADDRESS, error: "" })}>{t("settings.actions.cancel")}</Button>
                           <Button type="button" className="h-7 bg-primary px-3 text-xs text-white hover:bg-blue-600" onClick={handleTrySaveLocation}>{t("settings.actions.saveAddress")}</Button>
                        </div>
                     </div>
                  ) : (
                     <div className="flex items-center justify-between gap-4 mt-1">
                        <div className="text-sm text-slate-200">
                           {profile?.location ? formatAddressString(profile.location) : t("settings.location.noAddress")}
                        </div>
                        {isEditable && (
                           <Button
                              type="button"
                              variant="outline"
                              className="h-7 border-slate-700 bg-white/5 px-2.5 text-xs text-slate-200 hover:bg-white/10 shrink-0"
                              onClick={() => setLocationState({
                                 mode: "edit",
                                 draft: profile?.location || INITIAL_ADDRESS,
                                 error: ""
                              })}
                           >
                              {profile?.location ? t("settings.actions.edit") : t("settings.actions.addAddress")}
                           </Button>
                        )}
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>

         <AppModal
            isOpen={Boolean(pendingSave)}
            type="confirm"
            title={isLocationModal ? t("settings.modal.saveAddressTitle") : `Save ${taxKeyLabel}?`}
            description={isLocationModal ? t("settings.modal.saveAddressDesc") : `This updates the ${taxKeyLabel} identifier used on all future tax documents. The change will be recorded in the security audit logs.`}
            loading={saving}
            confirmLabel={t("settings.modal.confirmSave")}
            onConfirm={handleConfirmSave}
            onCancel={() => setPendingSave(null)}
            onClose={() => setPendingSave(null)}
         />
      </div>
   );
}