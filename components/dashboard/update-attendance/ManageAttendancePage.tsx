"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import en from "@/message/en.json";
import { attendanceService, Participant, Program } from "@/services/attendanceService";
import { ParticipantListTable } from "@/components/dashboard/update-attendance/ParticipantListTable";
import { AttendanceModals } from "@/components/dashboard/update-attendance/AttendanceModals";
import { ROUTES } from "@/constants/navigation";

function normalizeParticipants(raw: unknown[]): Participant[] {
  return raw.map((item) => {
    const p = item as Record<string, unknown>;
    const id = p.id ?? p._id ?? p.userId;
    return {
      id: String(id),
      username: String(p.username ?? ""),
      email: String(p.email ?? ""),
    };
  });
}

function buildAttendanceMap(records: unknown[]): { [key: string]: "present" | "absent" } {
  const map: { [key: string]: "present" | "absent" } = {};
  if (!Array.isArray(records) || records.length === 0) return map;

  const record = records[0] as {
    participants?: Array<{ participantId?: unknown; present_status?: "present" | "absent" }>;
  };
  (record.participants ?? []).forEach((p) => {
    if (p.participantId && p.present_status) {
      map[String(p.participantId)] = p.present_status;
    }
  });
  return map;
}

export function ManageAttendancePage() {
  const t = en.updateAttendance;
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;

  const [program, setProgram] = useState<Program | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: "present" | "absent" }>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (programId) {
      fetchData();
    }
  }, [programId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const programsRes = await attendanceService.getPrograms(1, 100);
      const payload = programsRes.data ?? programsRes;
      const progs: Program[] = payload.programs ?? [];
      setProgram(progs.find((p) => p._id === programId) ?? null);

      const participantsRes = await attendanceService.getParticipants(programId);
      const participantData = participantsRes.data ?? participantsRes ?? [];
      setParticipants(normalizeParticipants(Array.isArray(participantData) ? participantData : []));

      try {
        const attendanceRes = await attendanceService.getAttendance(programId);
        const attendanceData = attendanceRes.data ?? attendanceRes ?? [];
        setAttendance(buildAttendanceMap(Array.isArray(attendanceData) ? attendanceData : []));
      } catch (err) {
        console.error("No existing attendance found or error fetching", err);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (participantId: string, status: "present" | "absent") => {
    setAttendance((prev) => ({
      ...prev,
      [participantId]: status,
    }));
  };

  const handleSaveClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const records = Object.keys(attendance).map((id) => ({
        participantId: id,
        present_status: attendance[id],
      }));

      if (records.length === 0) {
        setError("Please mark attendance for at least one participant.");
        setSaving(false);
        setConfirmModalOpen(false);
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      await attendanceService.saveAttendance(programId, today, records);

      setConfirmModalOpen(false);
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      console.error(err);
      const apiErr = err as { response?: { data?: { message?: string | string[] } } };
      const apiMsg = apiErr.response?.data?.message;
      const errorMsg = Array.isArray(apiMsg) ? apiMsg.join(", ") : apiMsg;
      setError(errorMsg || t.errorSaveAttendance || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const handleDone = () => {
    setSuccessModalOpen(false);
    router.push(ROUTES.PROVIDER.ATTENDANCE);
  };

  const programTitle = program?.title || "Program";

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-[#333b45] p-6 text-card-foreground min-h-[600px]">
      <div className="flex flex-col items-center justify-center mb-8">
        <h2 className="text-lg font-semibold">Program: {programTitle}</h2>
        {program && (
          <p className="text-sm text-gray-400 mt-1">
            {program.startDate
              ? new Date(program.startDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : "-"}{" "}
            · {program.venueName} · {participants.length} participants
          </p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium">{t.participantList}</h3>
      </div>

      <ParticipantListTable
        participants={participants}
        attendance={attendance}
        loading={loading}
        onAttendanceChange={handleAttendanceChange}
        t={t}
      />

      <div className="flex justify-center w-full gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-transparent text-white border border-gray-500 hover:bg-gray-800"
        >
          {t.backButton}
        </Button>
        <Button
          onClick={handleSaveClick}
          className="bg-transparent text-white border border-gray-500 hover:bg-gray-800"
        >
          {t.saveButton}
        </Button>
      </div>

      <AttendanceModals
        confirmModalOpen={confirmModalOpen}
        successModalOpen={successModalOpen}
        saving={saving}
        error={error}
        programTitle={programTitle}
        participantCount={participants.length}
        onConfirmSave={handleConfirmSave}
        onCancelConfirm={() => setConfirmModalOpen(false)}
        onDoneSuccess={handleDone}
        t={t}
      />
    </div>
  );
}
