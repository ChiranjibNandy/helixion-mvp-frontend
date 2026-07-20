"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import InputField, { Label } from "../../ui/input";
import { t } from "@/lib/i18n";
import { PROGRAM_SAVED_STATUS } from "@/types";
import { useCreateProgram } from "@/hooks/useCreateProgram";
import AppModal from "../../ui/app-modal";
import { createProgramFormData, INITIAL_FORM_STATE } from "@/constants/training-provider";
import { STAY_TYPES } from "@/constants/content";
import LivePreview from "./Live-preview";
import StayOptionRow from "./Stay-option-row";
import PageHeader from "@/components/ui/pageHeader";



export default function CreateTrainingProgram() {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [actionType, setActionType] = useState<
    PROGRAM_SAVED_STATUS | null
  >(null);

  const [form, setForm] = useState<createProgramFormData>(INITIAL_FORM_STATE);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleField = <K extends keyof createProgramFormData>(key: K, value: createProgramFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleStayType = (stayId: string) => {
    setForm((prev) => ({
      ...prev,
      stayTypes: prev.stayTypes.map((s) =>
        s.id === stayId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const updateOptionPrice = (stayId: string, optionId: string, price: string) => {
    setForm((prev) => ({
      ...prev,
      stayTypes: prev.stayTypes.map((s) =>
        s.id === stayId
          ? {
            ...s,
            options: s.options.map((o) => (o.id === optionId ? { ...o, price } : o)),
          }
          : s
      ),
    }));
  };

  const { createProgram, loading, error } = useCreateProgram();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleField("brochureFile", file);
  };

  const openConfirmModal = (type: PROGRAM_SAVED_STATUS) => {
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!actionType) return;

    const residential = form.stayTypes.find(
      (stay) => stay.id === "residential"
    );

    const nonResidential = form.stayTypes.find(
      (stay) => stay.id === "non-residential"
    );

    // IMPORTANT:
    // use actual option positions instead of wrong IDs

    const singleOccupancyFee =
      residential?.enabled &&
        residential.options[0]?.price
        ? Number(residential.options[0].price)
        : undefined;

    const twinSharingFee =
      residential?.enabled &&
        residential.options[1]?.price
        ? Number(residential.options[1].price)
        : undefined;

    const nonResidentialFee =
      nonResidential?.enabled &&
        nonResidential.options[0]?.price
        ? Number(nonResidential.options[0].price)
        : undefined;

    const payload = {
      title: form.programTitle,

      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      venue: form.venue || undefined,
      city: form.city || undefined,

      singleOccupancyFee,
      twinSharingFee,
      nonResidentialFee,

      brochure: form.brochureFile,

      minParticipants: form.minParticipants
        ? Number(form.minParticipants)
        : undefined,

      maxParticipants: form.maxParticipants
        ? Number(form.maxParticipants)
        : undefined,

      status: actionType,
    };


    const success = await createProgram(payload);

    if (success) {
      setForm({
        ...INITIAL_FORM_STATE,
        stayTypes: structuredClone(STAY_TYPES),
      });

      setConfirmOpen(false);
      setSuccessOpen(true);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bgMain px-6 py-8">
      {/* Page Header */}
      <PageHeader
        title={t("programme.createpageTitle")}
        description={t("programme.createpageDescription")}
      />
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        {/* ── Left: Form ─────────────────────────────────────────────────────── */}
        <div className="bg-bgCard border border-borderCard rounded-lg p-6 space-y-5">
          {/* Section label */}
          <div>
            <p className="text-xs font-medium text-textSecondary mb-0.5">{t('programme.createdetailsTitle')}</p>
            <p className="text-xs text-textSidebarMuted">{t('programme.createdetailsDescription')}</p>
          </div>

          <Separator className="bg-borderDark" />

          {/* Program Title */}
          <div className="grid grid-cols-[160px_1fr] items-start gap-4">
            <Label className="pt-2 text-sm text-textMuted">
              {t('programme.fields.programTitle')}
            </Label>

            <InputField
              value={form.programTitle}
              onChange={(e) => handleField("programTitle", e.target.value)}
              placeholder={t('programme.fields.programTitlePlaceholder')}
              className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm"
            />
          </div>

          {/* Program Dates */}
          <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
            <div className="pt-2">
              <Label className="text-sm text-textMuted">
                {t('programme.fields.programDates')}
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InputField
                type="date"
                value={form.startDate}
                onChange={(e) => handleField("startDate", e.target.value)}
                className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm"
              />

              <InputField
                type="date"
                value={form.endDate}
                onChange={(e) => handleField("endDate", e.target.value)}
                className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm"
              />
            </div>
          </div>


          {/* Venue */}
          <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
            <div className="pt-2">
              <Label className="text-sm text-textMuted">
                {t('programme.fields.venue')}
              </Label>
            </div>

            <InputField
              value={form.venue}
              onChange={(e) => handleField("venue", e.target.value)}
              placeholder={t('programme.fields.venuePlaceholder')}
              className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm"
            />
          </div>

          {/* City — drives local-vs-outstation travel notifications, must
              match an employee's placeOfPosting exactly (case/whitespace
              insensitive) to be treated as local training. */}
          <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
            <div className="pt-2">
              <Label className="text-sm text-textMuted">
                {t('programme.fields.city')}
              </Label>
            </div>

            <InputField
              value={form.city}
              onChange={(e) => handleField("city", e.target.value)}
              placeholder={t('programme.fields.cityPlaceholder')}
              className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm"
            />
          </div>

          <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
            {/* Left Label */}
            <div className="pt-2">
              <Label className="text-sm text-textMuted">
                {t('programme.fields.stayType')}
              </Label>

              <p className="text-xs text-textSidebarMuted mt-0.5">
                {t('programme.fields.programFee')}
              </p>
            </div>

            {/* Right Content */}
            <div className="space-y-3">
              {form.stayTypes.map((stay) => (
                <div key={stay.id} className="space-y-2">
                  {/* Parent stay type row */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={stay.id}
                      checked={stay.enabled}
                      onCheckedChange={() => toggleStayType(stay.id)}
                      className="border-borderDark data-[state=checked]:bg-primary data-[state=checked]:border-primary w-3.5 h-3.5"
                    />

                    <label
                      htmlFor={stay.id}
                      className="text-sm text-textSecondary font-medium cursor-pointer select-none"
                    >
                      {stay.label}
                    </label>
                  </div>

                  {/* Sub-options */}
                  {stay.enabled && (
                    <div className="space-y-2 pl-2">
                      {stay.options.map((opt) => (
                        <StayOptionRow
                          key={opt.id}
                          option={opt}
                          parentEnabled={stay.enabled}
                          onPriceChange={(optId, price) =>
                            updateOptionPrice(stay.id, optId, price)
                          }
                        />
                      ))}
                    </div>
                  )}

                  {/* Non-residential disabled state */}
                  {!stay.enabled && stay.id === "non-residential" && (
                    <div className="grid grid-cols-[160px_1fr] items-center gap-x-4 pl-6 opacity-40">
                      <div />

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textSidebarMuted text-sm">
                          ₹
                        </span>

                        <InputField
                          disabled
                          className="bg-inputBg border-borderDark text-textSecondary pl-7 h-9 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attach Brochure */}
          <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
            {/* Left Label */}
            <div className="pt-2">
              <Label className="text-sm text-textMuted">
                {t('programme.fields.attachBrochure')}
              </Label>
            </div>

            {/* Right Content */}
            <div>
              <label
                htmlFor="brochure-upload"
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-borderDark",
                  "bg-bgButton hover:bg-bgButtonHover text-textSecondary text-sm cursor-pointer transition-colors"
                )}
              >
                <Upload className="w-3.5 h-3.5" />
                {t('button.browse')}
              </label>

              <input
                id="brochure-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {form.brochureFile && (
                <p className="text-xs text-textMuted mt-1.5">
                  {form.brochureFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Min / Max Participants */}
          {/* Minimum Participants */}
          <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
            <div className="pt-2">
              <Label className="text-sm text-textMuted">
                {t('programme.fields.minimumParticipants')}
              </Label>
            </div>

            <InputField
              type="number"
              value={form.minParticipants}
              onChange={(e) => handleField("minParticipants", e.target.value)}
              className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm w-40"
            />
          </div>

          {/* Maximum Participants */}
          <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
            <div className="pt-2">
              <Label className="text-sm text-textMuted">
                {t('programme.fields.maximumParticipants')}
              </Label>
            </div>

            <InputField
              type="number"
              value={form.maxParticipants}
              onChange={(e) => handleField("maxParticipants", e.target.value)}
              className="bg-inputBg border-borderDark text-textSecondary h-9 text-sm w-40"
            />
          </div>

          <Separator className="bg-borderDark" />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              variant="outline"
              onClick={() => openConfirmModal(PROGRAM_SAVED_STATUS.DRAFT)}
              disabled={loading}
              className="border-borderDark text-textSecondary hover:bg-bgButton hover:text-foreground h-9 px-4 text-sm"
            >
              {t("button.saveDraft")}
            </Button>

            <Button
              onClick={() => openConfirmModal(PROGRAM_SAVED_STATUS.PUBLISHED)}
              disabled={loading}
              className="bg-primary hover:bg-primaryDark text-white h-9 px-4 text-sm"
            >
              {t("programme.publishProgram")}
            </Button>
          </div>
        </div>

        {/* ── Right: Live Preview ─────────────────────────────────────────────── */}
        <LivePreview data={form} />
      </div>
      {/* CONFIRM MODAL */}
      <AppModal
        isOpen={confirmOpen}
        type="confirm"
        title={
          actionType === PROGRAM_SAVED_STATUS.DRAFT
            ? "Save Draft?"
            : "Publish Program?"
        }
        description={
          actionType === PROGRAM_SAVED_STATUS.DRAFT
            ? "Are you sure you want to save this program as draft?"
            : "Are you sure you want to publish this program?"
        }
        confirmLabel={
          actionType === PROGRAM_SAVED_STATUS.DRAFT
            ? "Save Draft"
            : "Publish"
        }
        cancelLabel="Cancel"
        loading={loading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        error={error}
      />

      {/* SUCCESS MODAL */}
      <AppModal
        isOpen={successOpen}
        type="success"
        title={
          actionType === PROGRAM_SAVED_STATUS.DRAFT
            ? "Draft Saved"
            : "Program Published"
        }
        description={
          actionType === PROGRAM_SAVED_STATUS.DRAFT
            ? "Your training program has been saved successfully as draft."
            : "Your training program has been published successfully."
        }
        doneLabel="Done"
        onDone={() => setSuccessOpen(false)}
      />
    </div>
  );
}