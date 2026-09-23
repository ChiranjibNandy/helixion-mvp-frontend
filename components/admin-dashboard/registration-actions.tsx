'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

import { Registration } from '@/types/auth';
import { useApproveUser } from '@/hooks/useApproveUser';

import AppModal from '@/components/ui/app-modal';
import { AppAlert } from '@/components/shared/app-alert';

import { ApproveModalContent } from './approve-modal-content';

import { t } from '@/lib/i18n';
import { useRejectUser } from '@/hooks/useRejectUser';
import { RejectModalContent } from './reject-modal-content';

interface Props {
  user: Registration;
  refetch: () => void;
}

export function RegistrationActions({
  user,
  refetch,
}: Props) {
  const {
    isOpen,
    successOpen,
    role,
    loading,
    error,
    setRole,
    openModal,
    closeModal,
    approveUser: handleApproveUser,
    closeSuccess,
  } = useApproveUser({
    userId: user.id,
    onSuccess: refetch,
  });

  const {
    isOpen: rejectIsOpen,
    successOpen: rejectSuccessOpen,
    loading: rejectLoading,
    error: rejectError,
    openModal: rejectOpenModal,
    closeModal: rejectCloseModal,
    rejectUser: rejectRejectUser,
    closeSuccess: rejectCloseSuccess,
  } = useRejectUser({
    userId: user.id,
    onSuccess: refetch,
  });

  return (
    <>
      <div className="flex justify-end gap-3">
        <CheckCircle2
          size={18}
          className="text-green-400 cursor-pointer"
          onClick={openModal}
        />

        <XCircle
          size={18}
          className="text-red-400 cursor-pointer"
          onClick={rejectOpenModal}
        />
      </div>

      {/* Approve Modal */}
      <AppModal
        isOpen={isOpen}
        type="confirm"
        title={t('admin.approveUser.title')}
        description={
          <>
            <ApproveModalContent
              name={user.name}
              email={user.email}
              role={role}
              onRoleChange={setRole}
            />

            {error && (
              <div className="mt-3">
                <AppAlert
                  variant="destructive"
                  description={error}
                />
              </div>
            )}
          </>
        }
        confirmLabel={t('button.confirm')}
        cancelLabel={t('button.cancel')}
        loading={loading}
        onConfirm={handleApproveUser}
        onCancel={closeModal}
      />

      <AppModal
        isOpen={successOpen}
        type="success"
        title={t('admin.approveUser.successTitle')}
        description={t(
          'admin.approveUser.successDescription'
        )}
        doneLabel={t('button.done')}
        stats={[
          {
            label: t('admin.approveUser.roleAssigned'),
            variant: 'green',
          },
          {
            label: role,
            variant: 'blue',
          },
        ]}
        onDone={closeSuccess}
      />

      {/* Reject Modal */}
      <AppModal
        isOpen={rejectIsOpen}
        type="confirm"
        title={t('admin.rejectUser.title')}
        description={
          <>
            <RejectModalContent
              name={user.name}
              email={user.email}
            />

            {rejectError && (
              <div className="mt-3">
                <AppAlert
                  variant="destructive"
                  description={rejectError}
                />
              </div>
            )}
          </>
        }
        confirmLabel={t('button.reject')}
        cancelLabel={t('button.cancel')}
        loading={rejectLoading}
        onConfirm={rejectRejectUser}
        onCancel={rejectCloseModal}
      />

      <AppModal
        isOpen={rejectSuccessOpen}
        type="success"
        title={t('admin.rejectUser.successTitle')}
        description={t(
          'admin.rejectUser.successDescription'
        )}
        doneLabel={t('button.done')}
        onDone={rejectCloseSuccess}
      />
    </>
  );
}