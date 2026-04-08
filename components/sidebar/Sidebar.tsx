"use client";

import type { User, NavSection } from '@/types';
import { SidebarLogo }    from './SidebarLogo';
import { SidebarProfile } from './SidebarProfile';
import { SidebarMenu }    from './SidebarMenu';
import { SidebarFooter }  from './SidebarFooter';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  user: User;
  navSections: NavSection[];
  activeKey: string;
  onNavChange: (key: string) => void;
  onSignOut?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Sidebar({ user, navSections, activeKey, onNavChange, onSignOut }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-[#080e1a] border-r border-white/[0.06]">
      <SidebarLogo />
      <SidebarProfile user={user} />
      <SidebarMenu
        sections={navSections}
        activeKey={activeKey}
        onNavChange={onNavChange}
      />
      <SidebarFooter onSignOut={onSignOut} />
    </aside>
  );
}