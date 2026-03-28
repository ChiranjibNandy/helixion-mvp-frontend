"use client";

import { useState } from "react";
import { User, Role } from "@/types/registration";
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
import { RoleCard } from "./RoleCard";
import styles from "./ApproveModal.module.css";

interface ApproveModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (role: Role, note?: string) => void;
}

export function ApproveModal({ user, open, onClose, onConfirm }: ApproveModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (!selectedRole) return;
    onConfirm(selectedRole, note || undefined);
    setSelectedRole(null);
    setNote("");
  };

  const handleClose = () => {
    setSelectedRole(null);
    setNote("");
    onClose();
  };

  if (!user) return null;
  const initials = getInitials(user.name);
  const avatarColor = getAvatarColor(user.name);
  const registeredDate = formatRegistrationDate(user.createdAt);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve registration</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          {/* User summary card */}
          <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div
              className={styles.avatar}
              style={{ background: avatarColor }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Registered {registeredDate}
              </p>
            </div>
          </div>

          {/* Role selector — driven by config, not hardcoded */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Select role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((option) => (
                <RoleCard
                  key={option.role}
                  role={option.role}
                  title={option.label}
                  description={option.description}
                  selected={selectedRole === option.role}
                  onSelect={() => setSelectedRole(option.role)}
                />
              ))}
            </div>
          </div>

          {/* Optional approval note */}
          <div>
            <label
              htmlFor="approval-note"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Note{" "}
              <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <Textarea
              id="approval-note"
              placeholder="Add a note for the user or internal record..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedRole}>
            Confirm approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
