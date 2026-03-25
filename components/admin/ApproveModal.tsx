"use client";

import { useState } from "react";
import { User, Role } from "@/types/registration";
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

const roleOptions = [
  {
    role: "employee" as Role,
    title: "Employee",
    description: "Access training & enrollment",
  },
  {
    role: "training_provider" as Role,
    title: "Training provider",
    description: "Upload & manage programs",
  },
  {
    role: "manager" as Role,
    title: "Manager",
    description: "View team progress",
  },
  {
    role: "admin" as Role,
    title: "Admin",
    description: "Full platform access",
  },
];

export function ApproveModal({ user, open, onClose, onConfirm }: ApproveModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (selectedRole) {
      onConfirm(selectedRole, note || undefined);
      setSelectedRole(null);
      setNote("");
    }
  };

  const handleClose = () => {
    setSelectedRole(null);
    setNote("");
    onClose();
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const registeredDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve registration</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className={styles.avatar}>{initials}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Registered {registeredDate}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Select role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => (
                <RoleCard
                  key={option.role}
                  role={option.role}
                  title={option.title}
                  description={option.description}
                  selected={selectedRole === option.role}
                  onSelect={() => setSelectedRole(option.role)}
                />
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Note (optional)
            </label>
            <Textarea
              id="note"
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
