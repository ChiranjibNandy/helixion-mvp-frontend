"use client";

import React, { useState, useEffect } from "react";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import en from "@/message/en.json";

const t = en.dailyAttendanceGrid;

interface NotesCellProps {
  value: string;
  onSave: (notes: string) => void;
}

export function NotesCell({ value, onSave }: NotesCellProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  return (
    <TableCell className="min-w-[160px]">
      <Input
        value={draft}
        placeholder={t.notesPlaceholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onSave(draft);
        }}
        className="h-7 text-xs"
      />
    </TableCell>
  );
}
