'use client';

import { KeyRound, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthButton from '../../components/AuthButton';
import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/InputField';
import { loginUser } from '@/utils/authService';
import { parseApiError } from '@/utils/parseError';
import { SIGNIN_CONTENT } from '@/constants/content';
import { ROUTES, USER_ROLES } from '@/constants/navigation';
import { useForm } from '@/hooks/useForm';
import { validateLoginForm } from '@/utils/validators';

function LeftPanel() {
  const { STATS, LEFT_PANEL } = SIGNIN_CONTENT;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-2">
        <div className="h-px w-6 bg-primaryDark" />
        <div className="text-xs tracking-widest font-medium text-textMuted flex items-center gap-1">
          <span>{LEFT_PANEL.TAG}</span>
          <span className="text-accentYellow">{LEFT_PANEL.TAG_BADGE}</span>
        </div>
      </div>

      <div>
        <h1 className="text-5xl font-extrabold leading-tight text-white">
          {LEFT_PANEL.HEADLINE.PART1} <br />
          <span className="text-primary">{LEFT_PANEL.HEADLINE.HIGHLIGHT}</span>{' '}
          <span className="text-white">{LEFT_PANEL.HEADLINE.PART2}</span>
        </h1>
      </div>

      <p className="text-sm leading-relaxed text-textMuted">
        {LEFT_PANEL.DESCRIPTION}
      </p>

      <div className="h-px w-full bg-borderDark" />

      <div className="grid grid-cols-3 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <span className="text-3xl font-extrabold text-white leading-none">
              {s.value}
              <span className="text-primary">{s.accent}</span>
            </span>
            <span className="text-xs text-textMuted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RightPanel() {
  const router = useRouter();
  const { FORM } = SIGNIN_CONTENT;

  const {
    values,
    errors,
    formError,
    loading,
    handleChange,
    handleSubmit,
    setFormError,
  } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLoginForm,
    onSubmit: async (formValues) => {
      try {
        const res = await loginUser(formValues);

        if (res?.success) {
          // Only route to admin dashboard if user is admin
          if (res.data?.role === USER_ROLES.ADMIN) {
            router.push(ROUTES.ADMIN_DASHBOARD);
          } else {
            router.push(ROUTES.DASHBOARD);
          }
        }
      } catch (err: unknown) {
        const parsed = parseApiError(err);
        setFormError(parsed.message);
      }
    },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">{FORM.TITLE}</h2>

      {/*FORM ERROR */}
      {formError && (
        <div className="text-red-500 text-sm mb-4">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

        <InputField
          label={FORM.EMAIL_LABEL}
          icon={<Mail size={16} />}
          placeholder={FORM.EMAIL_PLACEHOLDER}
          type="email"
          value={values.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email')(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <div className="flex flex-col gap-1">
          <InputField
            label={FORM.PASSWORD_LABEL}
            icon={<KeyRound size={16} />}
            placeholder={FORM.PASSWORD_PLACEHOLDER}
            showToggle
            value={values.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password')(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="flex justify-start">
            <Link
              href="#"
              className="text-xs font-medium hover:underline mt-1 text-primary"
            >
              {FORM.FORGOT_PASSWORD}
            </Link>
          </div>
        </div>

        <AuthButton type="submit" loading={loading}>
          {FORM.SUBMIT_BUTTON}
        </AuthButton>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-borderDark" />
          <span className="text-xs tracking-widest text-gray-600">{FORM.OR_DIVIDER}</span>
          <div className="flex-1 h-px bg-borderDark" />
        </div>

        <p className="text-center text-sm text-textMuted">
          {FORM.NO_ACCOUNT}{' '}
          <Link href={ROUTES.SIGNUP} className="font-semibold hover:underline text-primary">
            {FORM.CREATE_ACCOUNT}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return <AuthLayout leftPanel={<LeftPanel />} rightPanel={<RightPanel />} />;
}