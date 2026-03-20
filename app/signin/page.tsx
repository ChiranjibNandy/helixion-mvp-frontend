'use client';

import { KeyRound, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AuthButton from '../../components/AuthButton';
import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/InputField';
import { loginUser } from '@/utils/authService';
import { parseApiError } from '@/utils/parseError';

const stats = [
  { value: '2.4M', accent: '+', label: 'Active learners' },
  { value: '98', accent: '%', label: 'Completion rate' },
  { value: '500', accent: '+', label: 'Enterprise clients' },
];

function LeftPanel() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-2">
        <div className="h-px w-6 bg-primaryDark" />
        <div className="text-xs tracking-widest font-medium text-textMuted flex items-center gap-1">
          <span>OPTION B · ROLE SELECTOR</span>
          <span className="text-accentYellow">★</span>
          <span>RECOMMENDED</span>
        </div>
      </div>

      <div>
        <h1 className="text-5xl font-extrabold leading-tight text-white">
          One platform. <br />
          <span className="text-primary">Three</span>{' '}
          <span className="text-white">workspaces.</span>
        </h1>
      </div>

      <p className="text-sm leading-relaxed text-textMuted">
        Training Admins, Corporate Employees, and Reporting Managers — each with a purpose-built
        dashboard, accessed through one unified login.
      </p>

      <div className="h-px w-full bg-borderDark" />

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
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

interface Errors {
  email?: string;
  password?: string;
}

function RightPanel() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState(''); // 🔥 important
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};

    if (!email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address.';
    }

    if (!password) {
      e.password = 'Password is required.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); // reset

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginUser({ email, password });

      if (res.success) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const parsed = parseApiError(err);
      setFormError(parsed.message); // 🔥 show properly
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>

      {/* 🔥 FORM ERROR */}
      {formError && (
        <div className="text-red-500 text-sm mb-4">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

        <InputField
          label="Email"
          icon={<Mail size={16} />}
          placeholder="you@company.com"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <div className="flex flex-col gap-1">
          <InputField
            label="Password"
            icon={<KeyRound size={16} />}
            placeholder="••••••••"
            showToggle
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="flex justify-start">
            <Link
              href="#"
              className="text-xs font-medium hover:underline mt-1 text-primary"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <AuthButton type="submit" loading={loading}>
          Sign In →
        </AuthButton>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-borderDark" />
          <span className="text-xs tracking-widest text-gray-600">OR</span>
          <div className="flex-1 h-px bg-borderDark" />
        </div>

        <p className="text-center text-sm text-textMuted">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold hover:underline text-primary">
            Create account →
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return <AuthLayout leftPanel={<LeftPanel />} rightPanel={<RightPanel />} />;
}