"use client";

import { CheckCircle2, KeyRound, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../components/Signup.module.css";
import AuthButton from "../../components/AuthButton";
import AuthLayout from "../../components/AuthLayout";
import InputField from "../../components/InputField";
import { registerUser } from "@/utils/authService";
import { parseApiError } from "@/utils/parseError";

const features = [
  "Role-based dashboard tailored to your job",
  "Real-time training analytics & reports",
  "Enterprise SSO & team management",
  "SOC 2 compliant — your data stays safe",
];

function LeftPanel() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-2">
        <div className="h-px w-6 bg-primaryDark" />
        <div className="text-xs tracking-widest font-medium text-textMuted flex items-center gap-1">
          <span>JOIN HELIXION · GET STARTED FREE</span>
          <span className="text-accentYellow">★</span>
        </div>
      </div>

      <div>
        <h1 className="text-5xl font-extrabold leading-tight text-white">
          Your workspace, <br />
          <span className="text-primary">ready</span>{" "}
          <span className="text-white">in seconds.</span>
        </h1>
      </div>

      <p className="text-sm leading-relaxed text-textMuted">
        Sign up once and get immediate access to the dashboard built for your
        role — no setup required.
      </p>

      <div className="h-px w-full bg-borderDark" />

      <ul className="flex flex-col gap-4">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
              <CheckCircle2 size={13} className="text-primary" />
            </span>
            <span className="text-sm text-textSecondary">{f}</span>
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
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};

    if (!username.trim()) e.username = "Username is required.";
    if (!email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Enter a valid email address.";
    }
    if (!password) {
      e.password = "Password is required.";
    } else if (password.length < 8) {
      e.password = "Password must be at least 8 characters.";
    }
    if (!confirm) {
      e.confirm = "Please confirm your password.";
    } else if (confirm !== password) {
      e.confirm = "Passwords do not match.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError("");
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await registerUser({
        username,
        email,
        password,
        confirmPassword: confirm,
      });

      if (res.success) {
        router.push("/signin");
      }
    } catch (err: any) {
      const parsed = parseApiError(err);

      if (parsed.fieldErrors) {
        setErrors(parsed.fieldErrors);
      } else if (parsed.message) {
        setFormError(parsed.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">
        Create your account
      </h2>

      {formError && (
        <div className="text-red-500 text-sm mb-4">{formError}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <InputField
          label="Username"
          icon={<User size={16} />}
          placeholder="johndoe"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          error={errors.username}
          autoComplete="username"
        />

        <InputField
          label="Work Email"
          icon={<Mail size={16} />}
          placeholder="you@company.com"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          error={errors.email}
          autoComplete="email"
        />

        <InputField
          label="Password"
          icon={<KeyRound size={16} />}
          placeholder="Min. 8 characters"
          showToggle
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          error={errors.password}
          autoComplete="new-password"
        />

        <InputField
          label="Confirm Password"
          icon={<KeyRound size={16} />}
          placeholder="Repeat your password"
          showToggle
          value={confirm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirm(e.target.value)
          }
          error={errors.confirm}
          autoComplete="new-password"
        />

        <AuthButton type="submit" loading={loading}>
          → Create Account
        </AuthButton>

        <p className="text-center text-sm text-textMuted">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold hover:underline text-primary"
          >
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
