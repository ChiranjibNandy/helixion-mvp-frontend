"use client";

import { useState, useEffect } from "react";
import type { User, Role } from "@/types/registration";
import { ROLE_OPTIONS } from "@/config/roles";
import { getInitials, getAvatarColor, formatRegistrationDate } from "@/utils/userUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ApproveModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (role: Role, note?: string) => void;
  /** True while PATCH /api/admin/users/:id is in flight (after optimistic list update). */
  isSubmitting?: boolean;
}

export function ApproveModal({
  user,
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ApproveModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (user) {
      setSelectedRole("");
      setNote("");
    }
  }, [user?.id]);

  const handleConfirm = () => {
    if (!selectedRole || isSubmitting) return;
    onConfirm(selectedRole, note.trim() || undefined);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedRole("");
    setNote("");
    onClose();
  };

  if (!user) return null;

  const initials = getInitials(user.name);
  const avatarColor = getAvatarColor(user.name);
  const registeredDate = formatRegistrationDate(user.createdAt);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="max-w-lg border-0 bg-bgCard p-0 text-textPrimary shadow-xl ring-1 ring-borderDark">
        <DialogHeader className="border-b border-borderDark px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-textPrimary">
            Approve & assign role
          </DialogTitle>
          <p className="text-sm font-normal text-textMuted mt-1">
            Choose a role and confirm to approve this user.
          </p>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-bgMain/80 border border-borderDark">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
              style={{ background: avatarColor }}
              aria-hidden
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-textPrimary truncate">{user.name}</h4>
              <p className="text-sm text-textMuted truncate">{user.email}</p>
              <p className="text-xs text-textMuted mt-1">Registered {registeredDate}</p>
            </div>
          </div>

          <div>
            <label
              htmlFor="approve-role"
              className="block text-sm font-medium text-textSecondary mb-2"
            >
              Role
            </label>
            <select
              id="approve-role"
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole((e.target.value || "") as Role | "")
              }
              disabled={isSubmitting}
              className={cn(
                "flex h-10 w-full rounded-md border border-borderDark bg-inputBg px-3 py-2 text-sm text-textPrimary",
                "focus:outline-none focus:ring-2 focus:ring-accentBlue/40 focus:border-accentBlue",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "[&>option]:bg-bgCard [&>option]:text-textPrimary"
              )}
            >
              <option value="">Select a role…</option>
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.role} value={opt.role}>
                  {opt.label} — {opt.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="approval-note"
              className="block text-sm font-medium text-textSecondary mb-2"
            >
              Note <span className="font-normal text-textMuted">(optional)</span>
            </label>
            <Textarea
              id="approval-note"
              placeholder="Internal note or message for the record…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              disabled={isSubmitting}
              className="border-borderDark bg-inputBg text-textPrimary placeholder:text-textMuted focus:ring-accentBlue/40 focus:border-accentBlue"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-borderDark px-6 py-4 bg-bgMain/30">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedRole || isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Confirm approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
