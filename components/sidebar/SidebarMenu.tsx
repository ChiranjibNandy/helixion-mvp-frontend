

"use client";

import type { NavSection } from '@/types';
import { SidebarNavItem } from './SidebarNavItem';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SidebarMenuProps {
  sections: NavSection[];
  activeKey: string;
  onNavChange: (key: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SidebarMenu({ sections, activeKey, onNavChange }: SidebarMenuProps) {
  return (
    <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
      {sections.map((section, idx) => (
        <div key={section.category} className={idx > 0 ? 'mt-3' : ''}>
          <p className="text-[9px] font-semibold tracking-widest uppercase text-white/25 px-1 mb-1.5">
            {section.category}
          </p>
          {section.items.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              isActive={activeKey === item.key}
              onClick={onNavChange}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}