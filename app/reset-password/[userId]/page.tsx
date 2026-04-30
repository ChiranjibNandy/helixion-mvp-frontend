'use client';

import { useParams } from 'next/navigation';
import { KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';
import InputField from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { t } from '@/lib/i18n';
import { ROUTES } from '@/constants/navigation';
import {
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  getPasswordStrengthScore
} from '@/utils/passwordStrength';
import { useResetPasswordFlow } from '@/hooks/useResetPasswordFlow';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const { userId } = useParams<{ userId: string }>();

  const [showPassword, setShowPassword] = useState(false);

  const {
    form,
    setField,
    submitNewPassword,
    loading,
    error,
    success
  } = useResetPasswordFlow(userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitNewPassword();
  };

  const passwordStrengthScore = getPasswordStrengthScore(form.password);
  const strengthLabel = getPasswordStrengthLabel(passwordStrengthScore);
  const strengthColor = getPasswordStrengthColor(passwordStrengthScore);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgMain px-4">

      <div className="w-full max-w-md bg-bgCard border border-borderCard rounded-2xl p-7 shadow-xl">

        {/* BACK */}
        <Link
          href={ROUTES.SIGNIN}
          className="flex items-center gap-2 text-xs text-textMuted hover:text-white mb-6"
        >
          <ArrowLeft size={14} />
          {t('auth.resetPassword.back')}
        </Link>

        {/* SUCCESS */}
        {success ? (
          <div className="flex flex-col items-start gap-4">

            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/10 text-green-400 border border-green-500/20">
              <ShieldCheck size={20} />
            </div>

            <h1 className="text-xl font-bold text-white">
              {t('auth.resetPassword.successTitle')}
            </h1>

            <p className="text-sm text-textMuted leading-relaxed">
              {t('auth.resetPassword.successDescription')}
            </p>

            <p className="text-xs text-primary/60">
              {t('auth.resetPassword.redirecting')}
            </p>

          </div>
        ) : (
          <>
            {/* ICON */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-primary/10 text-primary border border-primary/20">
              <KeyRound size={20} />
            </div>

            {/* TITLE */}
            <h1 className="text-xl font-bold text-white mb-2">
              {t('auth.resetPassword.title')}
            </h1>

            <p className="text-sm text-textMuted mb-6">
              {t('password.description')}
            </p>

            {/* ERROR */}
            {error && (
              <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* PASSWORD */}
              <InputField
                label={t('password.newPassword')}
                icon={<KeyRound size={15} />}
                type={showPassword ? 'text' : 'password'}
                showToggle
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder={t('auth.resetPassword.placeholderNew')}
                onToggle={() => setShowPassword((p) => !p)}
              />

              {/* STRENGTH */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full bg-white/10"
                        style={{
                          background:
                            i <= passwordStrengthScore ? strengthColor : undefined,
                        }}
                      />
                    ))}
                  </div>

                  <p className="text-xs mt-1" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </p>
                </div>
              )}

              {/* CONFIRM PASSWORD */}
              <InputField
                label={t('password.confirmPassword')}
                icon={<KeyRound size={15} />}
                type={showPassword ? 'text' : 'password'}
                showToggle
                value={form.confirmPassword}
                onChange={(e) => setField('confirmPassword', e.target.value)}
                placeholder={t('auth.resetPassword.placeholderConfirm')}
                onToggle={() => setShowPassword((p) => !p)}
              />

              {/* MISMATCH */}
              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">
                    {t('auth.resetPassword.passwordMismatch')}
                  </p>
                )}

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={
                  loading ||
                  !form.password ||
                  !form.confirmPassword ||
                  form.password !== form.confirmPassword
                }
                className="w-full bg-gradient-to-r from-primaryDark to-primary text-white shadow-glow"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t('auth.resetPassword.submit')
                )}
              </Button>

            </form>
          </>
        )}

      </div>
    </div>
  );
}