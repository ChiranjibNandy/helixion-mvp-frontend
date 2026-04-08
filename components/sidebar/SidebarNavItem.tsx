"use client"

import Link from 'next/link';
import type { NavItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick?: (key: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SidebarNavItem({ item, isActive, onClick }: SidebarNavItemProps) {
  const baseClass = `
    flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px]
    cursor-pointer transition-colors duration-150 mb-0.5 select-none
    ${isActive
      ? 'bg-blue-900/30 text-blue-300'
      : 'text-white/35 hover:text-white/60 hover:bg-white/5'}
  `;

  const inner = (
    <>
      <span
        className={`w-1 h-1 rounded-full flex-shrink-0 ${
          isActive ? 'bg-blue-400' : 'bg-current'
        }`}
      />
      {item.label}
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={baseClass} onClick={() => onClick?.(item.key)}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={baseClass} onClick={() => onClick?.(item.key)}>
      {inner}
    </div>
  );
}