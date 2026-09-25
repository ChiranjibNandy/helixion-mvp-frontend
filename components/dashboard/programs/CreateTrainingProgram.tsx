"use client";

import React, { useState } from "react";
import { PROGRAM_SAVED_STATUS } from "@/types";
import { useCreateProgram } from "@/hooks/useCreateProgram";
import AppModal from "../../ui/app-modal";
import { createProgramFormData, INITIAL_FORM_STATE } from "@/constants/training-provider";
import { STAY_TYPES } from "@/constants/content";
import { t } from "@/lib/i18n";
import BaseProgramForm from "./BaseProgram";
import LivePreview from "./Live-preview";

export default function CreateTrainingProgram() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [actionType, setActionType] = useState<PROGRAM_SAVED_STATUS | null>(null);

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

    const residential = form.stayTypes.find((stay) => stay.id === "residential");
    const nonResidential = form.stayTypes.find((stay) => stay.id === "non-residential");

    const singleOccupancyFee =
      residential?.enabled && residential.options[0]?.price
        ? Number(residential.options[0].price)
        : undefined;

    const twinSharingFee =
      residential?.enabled && residential.options[1]?.price
        ? Number(residential.options[1].price)
        : undefined;

    const nonResidentialFee =
      nonResidential?.enabled && nonResidential.options[0]?.price
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
      minParticipants: form.minParticipants ? Number(form.minParticipants) : undefined,
      maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
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
    <>
      <BaseProgramForm
        mode="create"
        title={t("programme.createpageTitle")}
        description={t("programme.createpageDescription")}
        formState={form}
        onFieldChange={(key, value) => handleField(key as keyof createProgramFormData, value)}
        onToggleStayType={toggleStayType}
        onUpdateOptionPrice={updateOptionPrice}
        onFileChange={handleFileChange}
        onSubmitDraft={() => openConfirmModal(PROGRAM_SAVED_STATUS.DRAFT)}
        onSubmitPublish={() => openConfirmModal(PROGRAM_SAVED_STATUS.PUBLISHED)}
        loading={loading}
        rightPanel={<LivePreview data={form} />} 
      />

      {/* CONFIRM MODAL */}
      <AppModal
        isOpen={confirmOpen}
        type="confirm"
        title={actionType === PROGRAM_SAVED_STATUS.DRAFT ? "Save Draft?" : "Publish Program?"}
        description={
          actionType === PROGRAM_SAVED_STATUS.DRAFT
            ? "Are you sure you want to save this program as draft?"
            : "Are you sure you want to publish this program?"
        }
        confirmLabel={actionType === PROGRAM_SAVED_STATUS.DRAFT ? "Save Draft" : "Publish"}
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
        title={actionType === PROGRAM_SAVED_STATUS.DRAFT ? "Draft Saved" : "Program Published"}
        description={
          actionType === PROGRAM_SAVED_STATUS.DRAFT
            ? "Your training program has been saved successfully as draft."
            : "Your training program has been published successfully."
        }
        doneLabel="Done"
        onDone={() => setSuccessOpen(false)}
      />
    </>
  );
}