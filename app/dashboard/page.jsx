'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Stat card ──────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1"
      style={{
        background:  '#0c1828',
        border:      '1px solid #1a2d45',
        borderTop:   `3px solid ${color}`,
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#4a5a72' }}>
        {label}
      </span>
      <span style={{ fontSize: 28, fontWeight: 800, color: '#e8edf5', letterSpacing: '-1px' }}>
        {value}
      </span>
      <span style={{ fontSize: 12, color: '#6b7d96' }}>{sub}</span>
    </div>
  )
}

// ── Role badge colours ──────────────────────
const ROLE_COLORS = {
  admin:    { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   text: '#f87171',  label: 'Training Admin'      },
  employee: { bg: 'rgba(59,111,224,0.12)',  border: 'rgba(59,111,224,0.3)', text: '#7aabff',  label: 'Corporate Employee'  },
  manager:  { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',  text: '#4ade80',  label: 'Reporting Manager'   },
}

// ─────────────────────────────────────────────
//  Dashboard Page
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('hx_token')
    if (!token) { router.replace('/'); return }

    // Verify token with server
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) { router.replace('/'); return }
        setUser(data.user)
      })
      .catch(() => router.replace('/'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('hx_token')
    localStorage.removeItem('hx_user')
    router.replace('/')
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '100vh', background: '#060d1a' }}
      >
        <div className="text-center">
          <span className="hx-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <p style={{ marginTop: 16, color: '#4a5a72', fontSize: 14 }}>Loading workspace…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.employee
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#060d1a', color: '#e8edf5', fontFamily: 'Bricolage Grotesque, sans-serif' }}>

      {/* ── Top Nav ── */}
      <nav
        className="flex items-center justify-between px-8 py-4"
        style={{ borderBottom: '1px solid #0c1b30', background: '#07101f' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #2554c7 0%, #1e40af 100%)',
              boxShadow: '0 4px 14px rgba(37,84,199,0.4)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>Hx</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px' }}>
            Helix<span style={{ color: '#3b6fe0' }}>i</span>on
          </span>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div style={{ fontSize: 13, fontWeight: 700, color: '#c8d4e8' }}>{user.username}</div>
            <div style={{ fontSize: 11, color: '#4a5a72' }}>{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl px-4 py-2"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border:     '1px solid rgba(239,68,68,0.25)',
              color:      '#f87171',
              fontSize:   13,
              fontWeight: 600,
              cursor:     'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="px-8 py-10" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Welcome header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px' }}>
              Welcome back, <span style={{ color: '#3b6fe0' }}>{user.username}</span> 👋
            </h1>
            <span
              className="rounded-full px-3 py-1"
              style={{
                background: roleStyle.bg,
                border:     `1px solid ${roleStyle.border}`,
                color:      roleStyle.text,
                fontSize:   12,
                fontWeight: 700,
              }}
            >
              {roleStyle.label}
            </span>
          </div>
          <p style={{ color: '#6b7d96', fontSize: 14.5 }}>
            Your Helixion workspace is ready. Account created on {joinedDate}.
          </p>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid sm:grid-cols-2  gap-4 mb-10">
          <StatCard label="COURSES ASSIGNED" value="12"  sub="3 due this week"   color="#3b6fe0" />
          <StatCard label="COMPLETED"         value="8"   sub="67% completion"    color="#22c55e" />
          <StatCard label="IN PROGRESS"       value="3"   sub="2 overdue"         color="#f59e0b" />
          <StatCard label="CERTIFICATES"      value="5"   sub="Last: Last month"  color="#a855f7" />
        </div>

        {/* ── Account info card ── */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: '#0c1828', border: '1px solid #1a2d45' }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#c8d4e8' }}>
            Account Details
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Username',   value: user.username },
              { label: 'Email',      value: user.email    },
              { label: 'Role',       value: roleStyle.label },
              { label: 'User ID',    value: String(user.id).slice(-8).toUpperCase() },
              { label: 'Member since', value: joinedDate  },
              { label: 'Status',     value: '✅ Active'  },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#4a5a72', marginBottom: 4 }}>
                  {label.toUpperCase()}
                </div>
                <div style={{ fontSize: 14, color: '#c8d4e8', fontWeight: 500 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#0c1828', border: '1px solid #1a2d45' }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#c8d4e8' }}>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: '📚 My Courses',      color: '#3b6fe0' },
              { label: '📊 View Reports',    color: '#22c55e' },
              { label: '🏆 Certificates',    color: '#a855f7' },
              { label: '⚙️ Settings',        color: '#f59e0b' },
            ].map(({ label, color }) => (
              <button
                key={label}
                style={{
                  background:  `rgba(${color === '#3b6fe0' ? '59,111,224' : color === '#22c55e' ? '34,197,94' : color === '#a855f7' ? '168,85,247' : '245,158,11'},0.1)`,
                  border:      `1px solid ${color}33`,
                  color,
                  borderRadius: 12,
                  padding:     '10px 18px',
                  fontSize:    13.5,
                  fontWeight:  600,
                  cursor:      'pointer',
                  fontFamily:  'inherit',
                  transition:  'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
