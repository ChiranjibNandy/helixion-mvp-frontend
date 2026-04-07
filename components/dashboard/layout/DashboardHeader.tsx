'use client';

import { Bell, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAuth';
import { ADMIN_CONTENT } from '@/constants/content';

/**
 * Dashboard header with notifications and logout
 */
export default function DashboardHeader() {
  const { logout } = useAdminAuth();
  const { TITLE } = ADMIN_CONTENT.DASHBOARD;

  return (
    <div className="bg-bgSidebar border-b border-borderSidebar px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">{TITLE}</h1>
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-bgNavActive rounded-lg transition-colors">
            <Bell size={20} className="text-textSidebar" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accentOrange rounded-full"></span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-bgButton hover:bg-bgButtonHover rounded-lg transition-colors"
          >
            <LogOut size={18} className="text-textSidebar" />
            <span className="text-white text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
