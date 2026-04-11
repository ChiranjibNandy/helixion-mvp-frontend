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
import { MODAL_CONTENT } from "@/constants/admin";
import { UI_DISPLAY_DURATIONS } from "@/constants/ui";

const MODAL_TITLE_ID = "approve-user-title";

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
  
  const { APPROVE_USER } = MODAL_CONTENT;

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
      }, UI_DISPLAY_DURATIONS.SUCCESS_STATE);
    },
    [onApprove, handleClose],
  );

  // Handle error callback
  const handleError = useCallback((userId: string, errorMessage: string) => {
    // Error is handled by the hook's error state, but could be logged to a service here
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
        title={APPROVE_USER.TITLE}
        titleId={MODAL_TITLE_ID}
        onClose={handleClose}
        disabled={loading}
      />

      <div className="p-6 space-y-6">
        <UserInfoCard name={user.name} email={user.email} />

        {showSuccess ? (
          <SuccessState message={APPROVE_USER.SUCCESS_MESSAGE} />
        ) : (
          <div className="space-y-6">
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
                {APPROVE_USER.SUBTITLE}
              </p>
            </div>

            {error && (
              <div className="bg-accentRed/10 border border-accentRed/30 rounded-lg p-3">
                <p className="text-accentRed text-sm">{error}</p>
              </div>
            )}

            <ModalFooter
              secondaryAction={{
                label: APPROVE_USER.CANCEL_LABEL,
                onClick: handleClose,
                disabled: loading,
              }}
              primaryAction={{
                label: APPROVE_USER.CONFIRM_LABEL,
                loadingLabel: APPROVE_USER.LOADING_LABEL,
                onClick: handleApprove,
                disabled: loading,
                loading,
              }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
