'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { Sidebar } from './ui/sidebar';
import { logoutAPI } from '@/services/authService';
import { removeAccessToken } from '@/utils/token';
import { ROUTES } from '@/constants/navigation';


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

  const router = useRouter();
  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);

  async function handleSignOut() {
    try {
      await logoutAPI();
    } catch {
      // proceed with local cleanup even if backend call fails
    }
    await removeAccessToken();
    router.push(ROUTES.AUTH.SIGNIN);
  }

  return (
    <div className="grid grid-cols-[180px_1fr] h-screen overflow-hidden bg-[#0b1120] font-sans">
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