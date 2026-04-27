'use client';

import { useState } from 'react';
import type { User } from '@/types';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { Sidebar } from './ui/Sidebar';


interface DashboardShellProps {
  user: User;
  children: React.ReactNode;
  navSections: any;
  defaultActiveKey: string;
  onSignOut?: () => void;
}

export function DashboardShell({
  user,
  children,
  navSections,
  defaultActiveKey,
  onSignOut,
}: DashboardShellProps) {

  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);

  function handleSignOut() {
    if (onSignOut) {
      onSignOut();
    } else {
      console.log('Sign out triggered');
    }
  }

  return (
    <div className="grid grid-cols-[180px_1fr] min-h-screen bg-[#0b1120] font-sans">
      <Sidebar
        user={user}
        navSections={navSections}
        activeKey={activeKey}
        onNavChange={setActiveKey}
        onSignOut={handleSignOut}
      />

      <div className="flex flex-col overflow-hidden">
        <DashboardHeader user={user} />

        <main className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}