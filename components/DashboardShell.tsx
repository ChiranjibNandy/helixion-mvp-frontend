'use client'
import { useState } from 'react';
import type { User } from '@/types';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { Sidebar } from './global/sidebar/Sidebar';
import { EMP_NAV_SECTIONS } from './global/Contant';


// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardShellProps {
  user: User;
  // The role-specific content is passed as children from the server page.
  // This keeps DashboardShell a pure layout client component — it never
  // fetches data itself. Each role view (server component) lives in page.tsx.
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DashboardShell({ user, children }: DashboardShellProps) {
  const [activeKey, setActiveKey] = useState<string>('enrollments');

  function handleSignOut() {
    // TODO: wire to your auth provider (e.g. next-auth signOut)
    console.log('Sign out triggered');
  }

  return (
    <div className="grid grid-cols-[180px_1fr] min-h-screen bg-[#0b1120] font-sans">
      {/* Sidebar */}
      <Sidebar
        user={user}
        navSections={EMP_NAV_SECTIONS}
        activeKey={activeKey}
        onNavChange={setActiveKey}
        onSignOut={handleSignOut}
      />

      {/* Main */}
      <div className="flex flex-col overflow-hidden">
        <DashboardHeader user={user} />

        {/* Role-specific content rendered by the server page */}
        <main className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}