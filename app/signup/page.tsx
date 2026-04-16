'use client';

import { CheckCircle2, KeyRound, Mail, User, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';
import { SIGNUP_CONTENT } from '@/constants/content';
import { ROUTES } from '@/constants/navigation';
import { registerAPI } from '@/utils/authService';
import { Button } from '@/components/ui/button';
import InputField from '@/components/ui/input';
import { useState } from 'react';
import { parseApiError } from '@/utils/parseError';

function LeftPanel() {
  const { FEATURES, LEFT_PANEL } = SIGNUP_CONTENT;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-2">
        <div className="h-px w-6 bg-primaryDark" />
        <div className="text-xs tracking-widest font-medium text-textMuted flex items-center gap-1">
          <span>{LEFT_PANEL.TAG}</span>
          <Star size={12} className="text-accentYellow fill-accentYellow" />
        </div>
      </div>

      <div>
        <h1 className="text-5xl font-extrabold leading-tight text-white">
          {LEFT_PANEL.HEADLINE}
        </h1>
      </div>

      {/* Sign up once and get immediate access to the dashboard built for your role — no setup required. */}

      {/* <p className="text-sm leading-relaxed text-textMuted">
        {LEFT_PANEL.DESCRIPTION}
      </p> */}

      <div className="h-px w-full bg-borderDark" />

      <ul className="flex flex-col gap-4">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 icon-bg">
              <CheckCircle2 size={13} className="text-primary" />
            </span>
            <span className="text-sm text-textSecondary">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RightPanel() {
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

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);
    try {
      const res = await registerAPI(form);

      if (res.data.success) {
        router.push(ROUTES.SIGNIN);
      }
    } catch (err: any) {
      if (
        err &&
        typeof err === "object" &&
        !err.response
      ) {
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
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">
        {FORM.TITLE}
      </h2>

      {formError && (
        <div className="text-red-500 text-sm mb-4">{formError}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5"  autoComplete="off">
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
          <Link
            href={ROUTES.SIGNIN}
            className="font-semibold hover:underline text-primary"
          >
            {FORM.SIGN_IN}
          </Link>
        </p>
      </form>
    </div>
  );
}



export default function SignUpPage() {
  return <AuthLayout leftPanel={<LeftPanel />} rightPanel={<RightPanel />} />;
}
