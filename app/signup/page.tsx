'use client';

import { CheckCircle2, KeyRound, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthScene from '@/components/auth/AuthScene';
import { SIGNUP_CONTENT } from '@/constants/content';
import { ROUTES } from '@/constants/navigation';
import { registerAPI } from '@/services/authService';
import { Button } from '@/components/ui/button';
import InputField from '@/components/ui/input';
import { useState } from 'react';
import { parseApiError } from '@/utils/parseError';

function MarketingPanel() {
  const { FEATURES, LEFT_PANEL } = SIGNUP_CONTENT;

  return (
    <div className="flex flex-col gap-7 max-w-lg">
      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
        {LEFT_PANEL.HEADLINE}
      </h1>

      <div className="h-px w-full bg-borderDark" />

      <ul className="flex flex-col gap-4">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/15">
              <CheckCircle2 size={13} className="text-primary" />
            </span>
            <span className="text-sm text-textMuted">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SignUpCard() {
  const router = useRouter();
  const { FORM } = SIGNUP_CONTENT;

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);
    try {
      const res = await registerAPI(form);

      if (res.data.success) {
        router.push(ROUTES.AUTH.SIGNIN);
      }
    } catch (err: any) {
      if (err && typeof err === 'object' && !err.response) {
        setErrors(err);
        return;
      }
      const parsed = parseApiError(err);
      setFormError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl border border-borderDark bg-bgCard/90 backdrop-blur-xl p-9 shadow-2xl">
      <h2 className="text-2xl font-bold text-white">{FORM.TITLE}</h2>
      <p className="text-sm text-textMuted mt-1.5 mb-7">{FORM.SUBTITLE}</p>

      {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off">
        <InputField
          label={FORM.USERNAME_LABEL}
          icon={<User size={16} />}
          placeholder={FORM.USERNAME_PLACEHOLDER}
          value={form.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={errors.username}
          autoComplete="username"
        />

        <InputField
          label={FORM.EMAIL_LABEL}
          icon={<Mail size={16} />}
          placeholder={FORM.EMAIL_PLACEHOLDER}
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <InputField
          label={FORM.PASSWORD_LABEL}
          icon={<KeyRound size={16} />}
          placeholder={FORM.PASSWORD_PLACEHOLDER}
          showToggle
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />

        <InputField
          label={FORM.CONFIRM_PASSWORD_LABEL}
          icon={<KeyRound size={16} />}
          placeholder={FORM.CONFIRM_PASSWORD_PLACEHOLDER}
          showToggle
          value={form.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-br from-primaryDark to-primary text-white shadow-glow p-6"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            FORM.SUBMIT_BUTTON
          )}
        </Button>

        <p className="text-center text-sm text-textMuted">
          {FORM.HAS_ACCOUNT}{' '}
          <Link href={ROUTES.AUTH.SIGNIN} className="font-semibold hover:underline text-primary">
            {FORM.SIGN_IN}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignUpPage() {
  return <AuthScene marketing={<MarketingPanel />} card={<SignUpCard />} />;
}
