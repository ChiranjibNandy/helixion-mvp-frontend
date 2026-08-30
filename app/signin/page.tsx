'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, ShieldCheck, BookOpen, BarChart3, Wallet, Lock, FileCheck2, Cloud } from 'lucide-react';
import { loginAPI } from '@/services/authService';
import { parseApiError } from '@/utils/parseError';
import { SIGNIN_CONTENT } from '@/constants/content';
import { ROUTES, USER_ROLES } from '@/constants/navigation';
import { setAccessToken } from '@/utils/token';
import InputField from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthScene from '@/components/auth/AuthScene';

const FEATURE_ICONS = { 'book-open': BookOpen, 'shield-check': ShieldCheck, 'bar-chart': BarChart3, wallet: Wallet } as const;
const TRUST_ICONS = { lock: Lock, shield: ShieldCheck, 'file-check': FileCheck2, cloud: Cloud } as const;

function MarketingPanel() {
  const { HEADLINE, DESCRIPTION, FEATURES, TRUST_ITEMS, TRUSTED_BY } = SIGNIN_CONTENT;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white uppercase">
          {HEADLINE.LINE_1}
          <br />
          {HEADLINE.LINE_2_PLAIN}
          <span className="text-primary">{HEADLINE.LINE_2_ACCENT}</span>
        </h1>
        <div className="h-1 w-14 bg-primary rounded-full mt-5" />
      </div>

      <p className="text-base leading-relaxed text-textMuted max-w-lg">{DESCRIPTION}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {FEATURES.map((feature) => {
          const Icon = FEATURE_ICONS[feature.icon];
          return (
            <div key={feature.title} className="flex flex-col gap-2.5">
              <Icon size={22} className="text-primary" />
              <span className="text-xs font-bold tracking-wider text-white">{feature.title}</span>
              <p className="text-xs leading-relaxed text-textMuted">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="h-px w-full bg-borderDark" />

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {TRUST_ITEMS.map((item) => {
          const Icon = TRUST_ICONS[item.icon];
          return (
            <div key={item.label} className="flex items-center gap-2.5 text-xs text-textMuted max-w-[9rem]">
              <Icon size={16} className="text-primary shrink-0" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 pt-2">
        <span className="text-[11px] font-bold tracking-widest text-textMuted">{TRUSTED_BY.EYEBROW}</span>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {TRUSTED_BY.LOGOS.map((name) => (
            <span key={name} className="text-sm font-semibold text-textMuted/70">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignInCard() {
  const router = useRouter();
  const { FORM } = SIGNIN_CONTENT;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowSave, setAllowSave] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      const res = await loginAPI(form);

      if (res.data.success) {
        setAllowSave(true);
        const { accessToken, orgRole } = res.data;

        if (accessToken) {
          await setAccessToken(accessToken);
        }

        if (orgRole === USER_ROLES.ADMIN) {
          router.push(ROUTES.DASHBOARD.ADMIN);
        } else {
          router.push(ROUTES.DASHBOARD.ROOT);
        }
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

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="w-full max-w-lg rounded-2xl border border-borderDark bg-bgCard/90 backdrop-blur-xl p-9 shadow-2xl">
      <h2 className="text-2xl font-bold text-white">{FORM.TITLE}</h2>
      <p className="text-sm text-textMuted mt-1.5 mb-7">{FORM.SUBTITLE}</p>

      {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete={allowSave ? 'on' : 'off'} noValidate>
        <InputField
          label={FORM.EMAIL_LABEL}
          icon={<Mail size={16} />}
          placeholder={FORM.EMAIL_PLACEHOLDER}
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          autoComplete="username"
        />

        <div className="flex flex-col gap-1">
          <InputField
            label={FORM.PASSWORD_LABEL}
            icon={<KeyRound size={16} />}
            placeholder={FORM.PASSWORD_PLACEHOLDER}
            showToggle
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
          <div className="flex justify-start">
            <Link href="/forgot-password" className="text-xs font-medium hover:underline mt-1 text-primary">
              {FORM.FORGOT_PASSWORD}
            </Link>
          </div>
        </div>

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
          {FORM.NO_ACCOUNT}{' '}
          <Link href={ROUTES.AUTH.SIGNUP} className="font-semibold hover:underline text-primary">
            {FORM.CREATE_ACCOUNT}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return <AuthScene marketing={<MarketingPanel />} card={<SignInCard />} />;
}
