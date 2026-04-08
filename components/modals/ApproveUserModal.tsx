"use client";

import { useState, useCallback, useEffect } from "react";
import { ApproveUserModalProps } from "@/types/user.types";
import { UserRole, DEFAULT_APPROVAL_ROLE } from "@/constants/roles";
import { useApproveUser } from "@/hooks/useUpdateUserRole";
import RoleDropdown from "@/components/common/RoleDropdown";
import Modal from "@/components/ui/Modal";
import ModalHeader from "@/components/ui/ModalHeader";
import ModalFooter from "@/components/ui/ModalFooter";
import UserInfoCard from "@/components/ui/UserInfoCard";
import SuccessState from "@/components/ui/SuccessState";

// Constants for modal configuration
const MODAL_TITLE = "Approve User";
const MODAL_TITLE_ID = "approve-user-title";
const SUCCESS_MESSAGE = "User Approved!";
const SUCCESS_DISPLAY_DURATION = 1500;

export default function ApproveUserModal({
  isOpen,
  onClose,
  user,
  onApprove,
}: ApproveUserModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    DEFAULT_APPROVAL_ROLE,
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle modal close with cleanup
  const handleClose = useCallback(() => {
    if (loading) return;
    setShowSuccess(false);
    clearError();
    onClose();
  }, [onClose]);

  // Handle success callback - close modal after showing success state
  const handleSuccess = useCallback(
    (userId: string, role: UserRole) => {
      setShowSuccess(true);

      // Notify parent of successful approval
      onApprove(userId, role).catch(() => {
        // Parent handles the actual state update
      });

      setTimeout(() => {
        handleClose();
      }, SUCCESS_DISPLAY_DURATION);
    },
    [onApprove, handleClose],
  );

  // Handle error callback
  const handleError = useCallback((userId: string, errorMessage: string) => {
    console.error(`Failed to approve user ${userId}:`, errorMessage);
  }, []);

  const { approve, loading, error, clearError } = useApproveUser(
    handleSuccess,
    handleError,
  );

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(DEFAULT_APPROVAL_ROLE);
      setShowSuccess(false);
      clearError();
    }
  }, [isOpen, clearError]);

  // Handle approve button click
  const handleApprove = useCallback(async () => {
    if (!user || loading) return;

    try {
      await approve(user.id, selectedRole);
    } catch {
      // Error is handled by the hook's error callback
    }
  }, [user, selectedRole, approve, loading]);

  // Don't render if not open or no user
  if (!isOpen || !user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabelledBy={MODAL_TITLE_ID}
    >
      <ModalHeader
        title={MODAL_TITLE}
        titleId={MODAL_TITLE_ID}
        onClose={handleClose}
        disabled={loading}
      />

      <div className="p-6 space-y-6">
        <UserInfoCard name={user.name} email={user.email} />

        {showSuccess ? (
          <SuccessState message={SUCCESS_MESSAGE} />
        ) : (
          <>
            <div className="space-y-3">
              <label
                htmlFor="role-select"
                className="block text-textSecondary text-sm font-medium"
              >
                Assign Role
              </label>
              <RoleDropdown
                value={selectedRole}
                onChange={setSelectedRole}
                disabled={loading}
              />
              <p className="text-textSidebarMuted text-xs">
                Select the appropriate role for this user.
              </p>
            </div>

            {error && (
              <div className="bg-accentRed/10 border border-accentRed/30 rounded-lg p-3">
                <p className="text-accentRed text-sm">{error}</p>
              </div>
            )}

            <ModalFooter
              secondaryAction={{
                label: "Cancel",
                onClick: handleClose,
                disabled: loading,
              }}
              primaryAction={{
                label: "Confirm & Approve",
                loadingLabel: "Approving...",
                onClick: handleApprove,
                disabled: loading,
                loading,
              }}
            />
          </>
        )}
      </div>
    </Modal>
  );
}
