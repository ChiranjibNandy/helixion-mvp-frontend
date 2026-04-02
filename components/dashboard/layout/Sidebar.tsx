'use client';

import { LayoutDashboard, BarChart3, Users, Shield, FileText, Settings, Zap, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SidebarProps } from '@/types/admin';
import { COLOR_CLASSES } from '@/constants/admin';

interface NavItemData {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

interface NavItemProps {
  item: NavItemData;
}

/**
 * Navigation item component for sidebar menu items
 */
function NavItem({ item }: NavItemProps) {
  const { icon, label, badge, isActive } = item;
  
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
      isActive ? 'bg-[#1e293b] text-white' : `${COLOR_CLASSES.TEXT_MUTED} hover:bg-[#1e293b]/50 hover:text-white`
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className={`${COLOR_CLASSES.PRIMARY} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
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
  const pathname = usePathname();

  const navigationItems: Array<{
    title: string;
    items: NavItemData[];
  }> = [
    {
      title: 'Overview',
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard', isActive: true },
        { icon: <BarChart3 size={20} />, label: 'Analytics', href: '/analytics' },
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: <Users size={20} />, label: 'Pending', href: '/pending', badge: pendingCount.toString() },
        { icon: <Users size={20} />, label: 'All users', href: '/users', badge: totalUsers.toString() },
        { icon: <Shield size={20} />, label: 'Roles & permissions', href: '/roles' },
        { icon: <FileText size={20} />, label: 'Bulk import', href: '/import' },
      ]
    },
    {
      title: 'Platform',
      items: [
        { icon: <Settings size={20} />, label: 'Programs', href: '/programs' },
        { icon: <Zap size={20} />, label: 'Organizations', href: '/organizations' },
        { icon: <Bell size={20} />, label: 'Audit log', href: '/audit' },
      ]
    },
    {
      title: 'General tools',
      items: [
        { icon: <Settings size={20} />, label: 'Support', href: '/support' },
        { icon: <Bell size={20} />, label: 'Integrations', href: '/integrations' },
        { icon: <Bell size={20} />, label: 'Notifications', href: '/notifications' },
      ]
    }
  ];

  return (
    <div className={`w-64 ${COLOR_CLASSES.BG_DARK} border-r ${COLOR_CLASSES.BORDER} h-screen flex flex-col`}>
      <div className={`p-6 border-b ${COLOR_CLASSES.BORDER}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${COLOR_CLASSES.PRIMARY} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">He</span>
          </div>
          <span className="text-white font-semibold text-lg">Helixion</span>
        </div>
      </div>

      <div className="flex-1 px-3 py-6">
        {navigationItems.map((section) => (
          <div key={section.title} className="mb-6">
            <div className={`${COLOR_CLASSES.TEXT_MUTED} text-xs font-semibold uppercase tracking-wider px-4 mb-3`}>
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 border-t ${COLOR_CLASSES.BORDER}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${COLOR_CLASSES.PRIMARY} rounded-full flex items-center justify-center`}>
            <span className="text-white text-sm font-semibold">AD</span>
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">Admin</div>
            <div className={`${COLOR_CLASSES.TEXT_MUTED} text-xs`}>View profile</div>
          </div>
        </div>
      </div>
    </div>
  );
}
