'use client'

import React from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '../ui/LanguageSwitcher'




// ─────────────────────────────────────────────
//  RightPanel — login form panel
// ─────────────────────────────────────────────
export default function RightPanel() {
  const t = useTranslations('headings')
  const [role, setRole] = React.useState('manager')

  return (
    <div
      className="flex-1 flex items-center justify-center"
      style={{
        background: '#08101e',
        padding: '40px 24px',
      }}
    >
      {/* Card */}
      <div
        className="hx-fade-up w-full"
        style={{ maxWidth: 460 }}
      >

        {/* ── Header ── */}
        <div className="mb-7">
          <div className="mb-6">
            <LanguageSwitcher />
          </div>
          <h2

            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#e8edf5',
              letterSpacing: '-0.8px',
              marginBottom: 6,
            }}
          >
            {t('signIn')}
          </h2>


        </div>



        {/* ── Login Form ── */}
        <LoginForm />

      </div>
    </div>
  )
}


