'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

import { Registration } from '@/types/auth';
import { useApproveUser } from '@/hooks/useApproveUser';

import AppModal from '@/components/ui/app-modal';
import { AppAlert } from '@/components/shared/app-alert';

import { ApproveModalContent } from './approve-modal-content';

import { t } from '@/lib/i18n';

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
    approveUser,
    closeSuccess,
  } = useApproveUser({
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

        {/* <XCircle
          size={18}
          className="text-red-400 cursor-pointer"
        /> */}
      </div>

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
        onConfirm={approveUser}
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
    </>
  );
}