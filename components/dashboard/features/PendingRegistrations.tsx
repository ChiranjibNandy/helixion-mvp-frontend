"use client";

import { useState, useCallback, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { PendingRegistrationsProps } from "@/types/admin";
import { ADMIN_CONTENT } from "@/constants/content";
import { UserRole } from "@/constants/roles";
import RegistrationRow from "../ui/RegistrationRow";
import ApproveUserModal from "@/components/modals/ApproveUserModal";
import { RegistrationAvatar } from "@/components/ui/Avatar";

// User selection state for the approval modal
interface SelectedUser {
  id: string;
  name: string;
  email: string;
}

// Pending registrations table section with approve/deny actions
export default function PendingRegistrations({
  registrations: initialRegistrations,
  onRegistrationChange,
}: PendingRegistrationsProps) {
  const { SECTIONS } = ADMIN_CONTENT.DASHBOARD;

  // Local state for registrations to enable optimistic updates
  const [registrations, setRegistrations] = useState(initialRegistrations);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  // Sync with parent when initialRegistrations changes (e.g., on refresh)
  useEffect(() => {
    setRegistrations(initialRegistrations);
  }, [initialRegistrations]);

  // Remove a registration from the list (optimistic update)
  const removeRegistration = useCallback((userId: string) => {
    setRegistrations((prev) => prev.filter((reg) => reg.id !== userId));
    // Notify parent to refresh stats
    onRegistrationChange?.();
  }, [onRegistrationChange]);

  // Handle opening the approval modal for a specific user
  const handleApproveClick = useCallback(
    (registration: (typeof registrations)[0]) => {
      setSelectedUser({
        id: registration.id,
        name: registration.name,
        email: registration.email,
      });
      setIsModalOpen(true);
    },
    [registrations],
  );

  // Handle closing the modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedUser(null), 200);
  }, []);

 
  const handleApprove = useCallback(
    async (userId: string, role: UserRole) => {
      // Optimistically remove user from pending list immediately
      removeRegistration(userId);

      console.log(`User ${userId} approved with role: ${role}`);

      // Return resolved promise as required by ApproveUserModalProps
      return Promise.resolve();
    },
    [removeRegistration],
  );


  const handleDenyClick = useCallback(
    (registration: (typeof registrations)[0]) => {
      removeRegistration(registration.id);

      console.log(
        `User ${registration.id} denied and removed from pending list`,
      );
    },
    [removeRegistration],
  );

  return (
    <>
      <div className="bg-bgStatCard rounded-lg border border-borderCard">
        <div className="flex items-center justify-between p-6 border-b border-borderCard">
          <h2 className="text-white text-base font-semibold">
            {SECTIONS.PENDING_REGISTRATIONS}
          </h2>
          <button className="flex items-center gap-2 text-primary text-sm font-medium hover:text-primaryDark transition-colors">
            {SECTIONS.SEE_ALL}
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="p-6">
          {registrations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-textSidebarMuted text-sm">
                No pending registrations
              </p>
            </div>
          ) : (
            registrations.map((registration, index) => (
              <RegistrationRow
                key={registration.id}
                name={registration.name}
                email={registration.email}
                date={registration.date}
                avatar={
                  <RegistrationAvatar
                    name={registration.name}
                    index={index}
                  />
                }
                onApprove={() => handleApproveClick(registration)}
                onDeny={() => handleDenyClick(registration)}
              />
            ))
          )}
        </div>
      </div>

      {/* Approval Modal */}
      <ApproveUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        onApprove={handleApprove}
      />
    </>
  );
}
