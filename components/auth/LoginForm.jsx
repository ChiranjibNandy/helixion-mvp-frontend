'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconMail, IconKey, IconArrowRight, IconBriefcase } from '@/components/ui/Icons'

 
 
export default function LoginForm({ role }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password, role }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed. Please try again.')
        return
      }

      // Store JWT in localStorage
      localStorage.setItem('hx_token', data.token)
      localStorage.setItem('hx_user',  JSON.stringify(data.user))

      // Redirect to dashboard (or home)
      window.location.href = '/dashboard'
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── Email Field ── */}
      <div className="mb-3.5">
        <label
          className="block mb-1.5"
          style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: '#6b7d96' }}
        >
           EMAIL
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconMail size={15} color="#3a4f6a" />
          </span>
          <input
            type="email"
            className="hx-input w-full rounded-xl pl-10 pr-4 py-3.5 text-sm"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{
              background:   '#0c1828',
              border:       '1px solid #1a2d45',
              color:        '#c8d4e8',
              fontFamily:   'inherit',
              fontSize:     14,
            }}
          />
        </div>
      </div>

      {/* ── Password Field ── */}
      <div className="mb-4">
        <label
          className="block mb-1.5"
          style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: '#6b7d96' }}
        >
          PASSWORD
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <IconKey size={15} color="#3a4f6a" />
          </span>
          <input
            type="password"
            className="hx-input w-full rounded-xl pl-10 pr-4 py-3.5 text-sm"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{
              background:   '#0c1828',
              border:       '1px solid #1a2d45',
              color:        '#c8d4e8',
              fontFamily:   'inherit',
              fontSize:     14,
            }}
          />
        </div>
      </div>

      {/* ── Remember + Forgot ── */}
      <div className="flex items-center justify-between mb-5">
         
        <button
          type="button"
          className="forgot-link"
          style={{
            background: 'none', border: 'none',
            fontSize: 13, color: '#3b6fe0',
            fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}
        >
          Forgot password?
        </button>
      </div>

      {/* ── Error Message ── */}
      {error && (
        <div
          className="rounded-lg px-3.5 py-2.5 mb-4 text-sm"
          style={{
            background:   'rgba(239,68,68,0.1)',
            border:       '1px solid rgba(239,68,68,0.25)',
            color:        '#f87171',
          }}
        >
          {error}
        </div>
      )}

      {/* ── Primary Submit Button ── */}
      <button
        type="submit"
        disabled={loading}
        className="submit-btn w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5"
        style={{
          background:   loading
            ? 'rgba(42,92,232,0.55)'
            : 'linear-gradient(135deg, #2a5ce8 0%, #1e4bd4 100%)',
          border:       'none',
          color:        '#fff',
          fontSize:     14.5,
          fontWeight:   700,
          fontFamily:   'inherit',
          cursor:       loading ? 'not-allowed' : 'pointer',
          boxShadow:    loading ? 'none' : '0 4px 20px rgba(42,92,232,0.45)',
          letterSpacing: '0.01em',
        }}
      >
        {loading ? (
          <span className="hx-spinner" />
        ) : (
          <>
          <p>Sign In</p>
            <IconArrowRight size={15} color="#fff" />
           
          </>
        )}
      </button>

      {/* ── OR Divider ── */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
        <span style={{ fontSize: 11, color: '#3a4d63', fontWeight: 600, letterSpacing: '0.08em' }}>
          OR
        </span>
        <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* ── Corporate SSO Button ── */}
    

      {/* ── Register Link ── */}
      <p className="text-center mt-6" style={{ fontSize: 13.5, color: '#5a6d85' }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          style={{
            color: '#3b6fe0',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          className="register-link"
        >
          Create account →
        </Link>
      </p>
    </form>
  )
}
