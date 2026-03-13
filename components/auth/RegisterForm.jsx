'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconUser,
  IconMail,
  IconKey,
  IconEye,
  IconEyeOff,
  IconArrowRight,
} from '@/components/ui/Icons'

// ─────────────────────────────────────────────
//  Password strength calculator
// ─────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)               score++
  if (/[A-Z]/.test(pw))             score++
  if (/[0-9]/.test(pw))             score++
  if (/[^A-Za-z0-9]/.test(pw))      score++

  const map = [
    { label: '',         color: 'transparent',  width: '0%'   },
    { label: 'Weak',     color: '#ef4444',       width: '25%'  },
    { label: 'Fair',     color: '#f59e0b',       width: '50%'  },
    { label: 'Good',     color: '#3b82f6',       width: '75%'  },
    { label: 'Strong',   color: '#22c55e',       width: '100%' },
  ]
  return map[score] ?? map[0]
}

// ─────────────────────────────────────────────
//  Field wrapper
// ─────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <label
        className="block mb-1.5"
        style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: '#6b7d96' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
//  RegisterForm Component
// ─────────────────────────────────────────────
export default function RegisterForm() {
  const [username, setUsername]   = useState('')
  const [email,    setEmail]      = useState('')
  const [password, setPassword]   = useState('')
  const [confirm,  setConfirm]    = useState('')
  const [showPw,   setShowPw]     = useState(false)
  const [showCf,   setShowCf]     = useState(false)
  const [agree,    setAgree]      = useState(false)
  const [loading,  setLoading]    = useState(false)
  const [error,    setError]      = useState('')
  const [success,  setSuccess]    = useState(false)

  const strength = getStrength(password)

  const inputStyle = {
    background: '#0c1828',
    border:     '1px solid #1a2d45',
    color:      '#c8d4e8',
    fontFamily: 'inherit',
    fontSize:   14,
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) { setError('Username is required.'); return }
    if (!email.trim())    { setError('Email is required.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (!agree) { setError('Please accept the terms to continue.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.')
        return
      }

      // Store JWT in localStorage
      localStorage.setItem('hx_token', data.token)
      localStorage.setItem('hx_user',  JSON.stringify(data.user))
      setSuccess(true)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ──
  if (success) {
    return (
      <div className="text-center py-6 hx-fade-up">
        <div
          className="mx-auto mb-5 flex items-center justify-center rounded-2xl"
          style={{
            width: 64, height: 64,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#e8edf5', marginBottom: 8 }}>
          Account created!
        </h3>
        <p style={{ fontSize: 14, color: '#6b7d96', marginBottom: 28, lineHeight: 1.6 }}>
          Welcome to Helixion, <strong style={{ color: '#c8d4e8' }}>{username}</strong>.
          <br />You can now sign in to your workspace.
        </p>
        <Link
          href="/"
          className="submit-btn inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-3.5"
          style={{
            background: 'linear-gradient(135deg, #2a5ce8 0%, #1e4bd4 100%)',
            color: '#fff', fontSize: 14.5, fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(42,92,232,0.45)',
          }}
        >
          <IconArrowRight size={15} color="#fff" />
          Go to Sign In
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── Username ── */}
      <Field label="USERNAME">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconUser size={15} color="#3a4f6a" />
          </span>
          <input
            type="text"
            className="hx-input w-full rounded-xl pl-10 pr-4 py-3.5"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            style={inputStyle}
          />
        </div>
      </Field>

      {/* ── Email ── */}
      <Field label="WORK EMAIL">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconMail size={15} color="#3a4f6a" />
          </span>
          <input
            type="email"
            className="hx-input w-full rounded-xl pl-10 pr-4 py-3.5"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={inputStyle}
          />
        </div>
      </Field>

      {/* ── Password ── */}
      <Field label="PASSWORD">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconKey size={15} color="#3a4f6a" />
          </span>
          <input
            type={showPw ? 'text' : 'password'}
            className="hx-input w-full rounded-xl pl-10 pr-11 py-3.5"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="pw-toggle absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a4f6a', padding: 2 }}
          >
            {showPw ? <IconEyeOff size={15} color="#3a4f6a" /> : <IconEye size={15} color="#3a4f6a" />}
          </button>
        </div>

        {/* Strength bar */}
        {password && (
          <div className="mt-2">
            <div
              className="rounded-full mb-1"
              style={{ height: 3, background: '#0e1e32', overflow: 'hidden' }}
            >
              <div
                className="strength-bar"
                style={{ width: strength.width, background: strength.color, height: '100%' }}
              />
            </div>
            <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
              {strength.label}
            </span>
          </div>
        )}
      </Field>

      {/* ── Confirm Password ── */}
      <Field label="CONFIRM PASSWORD">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconKey size={15} color="#3a4f6a" />
          </span>
          <input
            type={showCf ? 'text' : 'password'}
            className="hx-input w-full rounded-xl pl-10 pr-11 py-3.5"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            style={{
              ...inputStyle,
              borderColor: confirm && confirm !== password ? 'rgba(239,68,68,0.5)' : '#1a2d45',
            }}
          />
          <button
            type="button"
            onClick={() => setShowCf((v) => !v)}
            className="pw-toggle absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a4f6a', padding: 2 }}
          >
            {showCf ? <IconEyeOff size={15} color="#3a4f6a" /> : <IconEye size={15} color="#3a4f6a" />}
          </button>
        </div>
        {confirm && confirm !== password && (
          <p style={{ fontSize: 11.5, color: '#f87171', marginTop: 5, fontWeight: 500 }}>
            Passwords do not match
          </p>
        )}
      </Field>
 

      {/* ── Error ── */}
      {error && (
        <div
          className="rounded-lg px-3.5 py-2.5 mb-4 text-sm"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border:     '1px solid rgba(239,68,68,0.25)',
            color:      '#f87171',
          }}
        >
          {error}
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={loading}
        className="submit-btn w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5"
        style={{
          background:    loading
            ? 'rgba(42,92,232,0.55)'
            : 'linear-gradient(135deg, #2a5ce8 0%, #1e4bd4 100%)',
          border:        'none',
          color:         '#fff',
          fontSize:      14.5,
          fontWeight:    700,
          fontFamily:    'inherit',
          cursor:        loading ? 'not-allowed' : 'pointer',
          boxShadow:     loading ? 'none' : '0 4px 20px rgba(42,92,232,0.45)',
          letterSpacing: '0.01em',
        }}
      >
        {loading ? (
          <span className="hx-spinner" />
        ) : (
          <>
            <IconArrowRight size={15} color="#fff" />
            <span>Create Account</span>
          </>
        )}
      </button>

      {/* ── Sign In Link ── */}
      <p className="text-center mt-5" style={{ fontSize: 13.5, color: '#5a6d85' }}>
        Already have an account?{' '}
        <Link
          href="/"
          style={{ color: '#3b6fe0', fontWeight: 700, textDecoration: 'none' }}
          className="register-link"
        >
          Sign in →
        </Link>
      </p>
    </form>
  )
}
