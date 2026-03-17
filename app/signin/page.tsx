'use client';

import { KeyRound, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AuthButton from '../../components/AuthButton';
import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/InputField';

const stats = [
  { value: '2.4M', accent: '+', label: 'Active learners' },
  { value: '98', accent: '%', label: 'Completion rate' },
  { value: '500', accent: '+', label: 'Enterprise clients' },
];

function LeftPanel() {
  return (
    <div className="flex flex-col gap-7">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <div className="h-px w-6" style={{ backgroundColor: '#3b5bdb' }} />
        <span className="text-xs tracking-widest font-medium" style={{ color: '#9ca3af' }}>
          OPTION B · ROLE SELECTOR{' '}
          <span style={{ color: '#facc15' }}>★</span>{' '}
          RECOMMENDED
        </span>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-5xl font-extrabold leading-tight text-white">
          One platform.
        </h1>
        <h1 className="text-5xl font-extrabold leading-tight">
          <span style={{ color: '#4f7cff' }}>Three</span>{' '}
          <span className="text-white">workspaces.</span>
        </h1>
      </div>

      {/* Subtext */}
      <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
        Training Admins, Corporate Employees, and Reporting Managers — each with a purpose-built
        dashboard, accessed through one unified login.
      </p>

      {/* Divider */}
      <div className="h-px w-full" style={{ backgroundColor: '#1f2937' }} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <span className="text-3xl font-extrabold text-white leading-none">
              {s.value}
              <span style={{ color: '#4f7cff' }}>{s.accent}</span>
            </span>
            <span className="text-xs" style={{ color: '#9ca3af' }}>
              {s.label}
            </span>
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
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
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Sign In:', { email, password });
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <InputField
          label="Email"
          icon={<Mail size={16} />}
          placeholder="you@company.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
          <div className="flex justify-start">
            <Link
              href="#"
              className="text-xs font-medium hover:underline mt-1"
              style={{ color: '#4f7cff' }}
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="mt-1">
          <AuthButton type="submit" loading={loading}>
            Sign In →
          </AuthButton>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: '#1f2937' }} />
          <span className="text-xs tracking-widest" style={{ color: '#4b5563' }}>
            OR
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#1f2937' }} />
        </div>

        <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold hover:underline" style={{ color: '#4f7cff' }}>
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
