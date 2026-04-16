'use client';

import { KeyRound, Mail, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';
import { loginAPI } from '@/utils/authService';
import { parseApiError } from '@/utils/parseError';
import { SIGNIN_CONTENT } from '@/constants/content';
import { ROUTES, USER_ROLES } from '@/constants/navigation';
import InputField from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { decodeJwtPayload, getAccessToken } from '@/utils/token';
import { useState } from 'react';


function LeftPanel() {
  const { STATS, LEFT_PANEL } = SIGNIN_CONTENT;

  return (
    <div className="flex flex-col gap-7">
      {/*  
      OPTION B · ROLE SELECTOR RECOMMENDED  
      */}

      {/* <div className="flex items-center gap-2">
        <div className="h-px w-6 bg-primaryDark" />
        <div className="text-xs tracking-widest font-medium text-textMuted flex items-center gap-1">
          <span></span>
          <Star size={12} className="text-accentYellow fill-accentYellow" />
          <span className="text-accentYellow"></span>
        </div>
      </div> */}

      <div>
        <h1 className="text-5xl font-extrabold leading-tight text-white whitespace-pre-line">
          {LEFT_PANEL.HEADLINE}
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

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const res = await loginAPI(form);

      if (res.data.success) {
        const token = await getAccessToken();

        if (!token) {
          setFormError("Authentication failed");
          return;
        }

        const payload = await decodeJwtPayload(token);
        const role = payload.role;

        if (role === USER_ROLES.ADMIN) {
          router.push(ROUTES.ADMIN_DASHBOARD);
        } else {
          router.push(ROUTES.DASHBOARD);
        }
      }
    } catch (err: any) {
      if (typeof err === "object") {
        setErrors(err); 
      } else {
        const parsed = parseApiError(err);
        setFormError(parsed.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

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
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <div className="flex flex-col gap-1">
          <InputField
            label={FORM.PASSWORD_LABEL}
            icon={<KeyRound size={16} />}
            placeholder={FORM.PASSWORD_PLACEHOLDER}
            showToggle
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
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