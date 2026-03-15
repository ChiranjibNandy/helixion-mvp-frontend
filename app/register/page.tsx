import React from 'react'
import { Metadata } from 'next'
import RegisterLeftPanel  from '@/components/layout/RegisterLeftPanel'
import RegisterRightPanel from '@/components/layout/RegisterRightPanel'

// ─────────────────────────────────────────────
//  Register Page
//  Route: /register
//  Connected to: / (login page)
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  title:       'Helixion — Create Account',
  description: 'Join Helixion. Your workspace, ready in seconds.',
}

export default function RegisterPage() {
  return (
    <main
      className="flex"
      style={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}
    >
      {/* Branded left section */}
      <RegisterLeftPanel />

      {/* Register form right section */}
      <RegisterRightPanel />
    </main>
  )
}
