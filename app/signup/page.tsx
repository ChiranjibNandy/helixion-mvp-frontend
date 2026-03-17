'use client';

import { CheckCircle2, KeyRound, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AuthButton from '../../components/AuthButton';
import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/InputField';

const features = [
  'Role-based dashboard tailored to your job',
  'Real-time training analytics & reports',
  'Enterprise SSO & team management',
  'SOC 2 compliant — your data stays safe',
];

function LeftPanel() {
  return (
    <div className="flex flex-col gap-7">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <div className="h-px w-6" style={{ backgroundColor: '#3b5bdb' }} />
        <span className="text-xs tracking-widest font-medium" style={{ color: '#9ca3af' }}>
          JOIN HELIXION · GET STARTED FREE{' '}
          <span style={{ color: '#facc15' }}>★</span>
        </span>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-5xl font-extrabold leading-tight text-white">
          Your workspace,
        </h1>
        <h1 className="text-5xl font-extrabold leading-tight">
          <span style={{ color: '#4f7cff' }}>ready</span>{' '}
          <span className="text-white">in seconds.</span>
        </h1>
      </div>

      {/* Subtext */}
      <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
        Sign up once and get immediate access to the dashboard built for your role — no setup required.
      </p>

      {/* Divider */}
      <div className="h-px w-full" style={{ backgroundColor: '#1f2937' }} />

      {/* Feature list */}
      <ul className="flex flex-col gap-4">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span
              className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(59,91,219,0.18)' }}
            >
              <CheckCircle2 size={13} style={{ color: '#4f7cff' }} />
            </span>
            <span className="text-sm" style={{ color: '#d1d5db' }}>
              {f}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

function RightPanel() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!username.trim()) e.username = 'Username is required.';
    if (!email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!password) {
      e.password = 'Password is required.';
    } else if (password.length < 8) {
      e.password = 'Password must be at least 8 characters.';
    }
    if (!confirm) {
      e.confirm = 'Please confirm your password.';
    } else if (confirm !== password) {
      e.confirm = 'Passwords do not match.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Sign Up:', { username, email, password });
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Create your account</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <InputField
          label="Username"
          icon={<User size={16} />}
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          autoComplete="username"
        />
        <InputField
          label="Work Email"
          icon={<Mail size={16} />}
          placeholder="you@company.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <InputField
          label="Password"
          icon={<KeyRound size={16} />}
          placeholder="Min. 8 characters"
          showToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <InputField
          label="Confirm Password"
          icon={<KeyRound size={16} />}
          placeholder="Repeat your password"
          showToggle
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <div className="mt-1">
          <AuthButton type="submit" loading={loading}>
            → Create Account
          </AuthButton>
        </div>

        <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold hover:underline" style={{ color: '#4f7cff' }}>
            Sign in →
          </Link>
        </p>


      </form>
    </div>
  );
}

export default function SignUpPage() {
  return <AuthLayout leftPanel={<LeftPanel />} rightPanel={<RightPanel />} />;
}
