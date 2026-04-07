'use client';

import { SidebarProps } from '@/types/admin';
import { getNavigationConfig, ROUTES } from '@/constants/navigation';
import { BRAND, ADMIN_CONTENT } from '@/constants/content';

interface NavItemProps {
  icon: React.ComponentType<{ size?: number | string }>;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

/**
 * Navigation item component for sidebar menu items
 */
function NavItem({ icon: Icon, label, badge, isActive }: NavItemProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
      isActive ? 'bg-bgNavActive text-white' : 'text-textSidebar hover:bg-bgNavActive/50 hover:text-white'
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5">
          <Icon size={20} />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium">
          {badge}
        </span>
      )}
    </div>
  );
}

/**
 * Main sidebar navigation component
 */
export default function Sidebar({ pendingCount, totalUsers }: SidebarProps) {
  const navigationConfig = getNavigationConfig(pendingCount, totalUsers);
  const { PROFILE } = ADMIN_CONTENT.SIDEBAR;
  const { LOGO_TEXT, NAME } = BRAND;

  return (
    <div className="w-64 bg-bgSidebar border-r border-borderSidebar h-screen flex flex-col">
      <div className="p-6 border-b border-borderSidebar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">{LOGO_TEXT}</span>
          </div>
          <span className="text-white font-semibold text-lg">{NAME}</span>
        </div>
      </div>

      <div className="flex-1 px-3 py-6">
        {navigationConfig.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="text-textSidebarMuted text-xs font-semibold uppercase tracking-wider px-4 mb-3">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  badge={item.badge}
                  isActive={item.isActive}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-borderSidebar">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{PROFILE.INITIALS}</span>
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">{PROFILE.NAME}</div>
            <div className="text-textSidebarMuted text-xs">{PROFILE.ACTION}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
