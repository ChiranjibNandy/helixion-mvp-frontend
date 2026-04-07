'use client';

import { CheckCircle2, KeyRound, Mail, User, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthButton from '../../components/AuthButton';
import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/InputField';
import { registerUser } from '@/utils/authService';
import { parseApiError } from '@/utils/parseError';
import { SIGNUP_CONTENT } from '@/constants/content';
import { ROUTES } from '@/constants/navigation';
import { useForm } from '@/hooks/useForm';
import { validateRegisterForm } from '@/utils/validators';

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
          {LEFT_PANEL.HEADLINE.PART1} <br />
          <span className="text-primary">{LEFT_PANEL.HEADLINE.HIGHLIGHT}</span>{" "}
          <span className="text-white">{LEFT_PANEL.HEADLINE.PART2}</span>
        </h1>
      </div>

      <p className="text-sm leading-relaxed text-textMuted">
        {LEFT_PANEL.DESCRIPTION}
      </p>

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
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateRegisterForm,
    onSubmit: async (formValues) => {
      try {
        const res = await registerUser({
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
        });

        if (res.success) {
          router.push(ROUTES.SIGNIN);
        }
      } catch (err: unknown) {
        const parsed = parseApiError(err);

        if (parsed.fieldErrors) {
          // Field errors are handled by the form hook
          Object.entries(parsed.fieldErrors).forEach(([field, message]) => {
            if (field === 'confirmPassword' || field === 'confirm') {
              // Map confirm field errors
            }
          });
        }
        setFormError(parsed.message);
      }
    },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">
        {FORM.TITLE}
      </h2>

      {formError && (
        <div className="text-red-500 text-sm mb-4">{formError}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <InputField
          label={FORM.USERNAME_LABEL}
          icon={<User size={16} />}
          placeholder={FORM.USERNAME_PLACEHOLDER}
          value={values.username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('username')(e.target.value)
          }
          error={errors.username}
          autoComplete="username"
        />

        <InputField
          label={FORM.EMAIL_LABEL}
          icon={<Mail size={16} />}
          placeholder={FORM.EMAIL_PLACEHOLDER}
          type="email"
          value={values.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('email')(e.target.value)
          }
          error={errors.email}
          autoComplete="email"
        />

        <InputField
          label={FORM.PASSWORD_LABEL}
          icon={<KeyRound size={16} />}
          placeholder={FORM.PASSWORD_PLACEHOLDER}
          showToggle
          value={values.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('password')(e.target.value)
          }
          error={errors.password}
          autoComplete="new-password"
        />

        <InputField
          label={FORM.CONFIRM_PASSWORD_LABEL}
          icon={<KeyRound size={16} />}
          placeholder={FORM.CONFIRM_PASSWORD_PLACEHOLDER}
          showToggle
          value={values.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('confirmPassword')(e.target.value)
          }
          error={errors.confirm}
          autoComplete="new-password"
        />

        <AuthButton type="submit" loading={loading}>
          {FORM.SUBMIT_BUTTON}
        </AuthButton>

        <p className="text-center text-sm text-textMuted">
          {FORM.HAS_ACCOUNT}{" "}
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