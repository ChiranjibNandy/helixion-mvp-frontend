'use client';

import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/ui/input';
import AppModal from '@/components/ui/app-modal';
import Link from 'next/link';
import { t } from '@/lib/i18n';
import { ROUTES } from '@/constants/navigation';
import { useResetPasswordFlow } from '@/hooks/useResetPasswordFlow';

export default function ForgotPasswordPage() {

  const {
    email,
    setEmail,
    sendResetLink,
    loading,
    error
  } = useResetPasswordFlow();

  const [successOpen, setSuccessOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // OPEN CONFIRM MODAL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setPendingEmail(email);
    setConfirmOpen(true);
  };

  // CONFIRM ACTION
  const handleConfirmSend = async () => {
    const success = await sendResetLink(pendingEmail);

    if (success) {
      setConfirmOpen(false);
      setSuccessOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgMain px-4">

      <div className="w-full max-w-md bg-bgCard border border-borderCard rounded-2xl p-7 shadow-xl">

        {/* BACK */}
        <Link
          href={ROUTES.SIGNIN}
          className="flex items-center gap-2 text-xs text-textMuted hover:text-white mb-6"
        >
          <ArrowLeft size={14} />
          {t('auth.forgotPassword.back')}
        </Link>

        {/* ICON */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-primary/10 text-primary border border-primary/20">
          <Mail size={20} />
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-bold text-white mb-2">
          {t('auth.forgotPassword.title')}
        </h1>

        <p className="text-sm text-textMuted mb-6 leading-relaxed">
          {t('auth.forgotPassword.description')}
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <InputField
            label={t('email.inputLabel')}
            icon={<Mail size={15} />}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email.inputPlaceholder')}
          />

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-gradient-to-r from-primaryDark to-primary text-white shadow-glow"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t('auth.forgotPassword.submit')
            )}
          </Button>

        </form>

      </div>

      {/* SUCCESS MODAL */}
      <AppModal
        isOpen={successOpen}
        type="success"
        title={t('auth.forgotPassword.successTitle')}
        description={t('auth.forgotPassword.successDescription', {
          email: pendingEmail
        })}
        doneLabel={t('button.done')}
        onDone={() => {
          setSuccessOpen(false);
          setEmail('');
          setPendingEmail('');
        }}
      />

      {/* CONFIRM MODAL */}
      <AppModal
        isOpen={confirmOpen}
        type="confirm"
        title={t('auth.forgotPassword.confirmTitle')}
        description={
          <div>
            <p>
              {t('auth.forgotPassword.confirmDescription', {
                email: pendingEmail
              })}
            </p>

            {error && (
              <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        }
        confirmLabel={t("button.send")}
        cancelLabel={t("button.cancel")}
        loading={loading}
        onConfirm={handleConfirmSend}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  );
}