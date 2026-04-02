'use client';

import { Bell, LogOut } from 'lucide-react';
import { COLOR_CLASSES } from '@/constants/admin';

/**
 * Dashboard header with notifications and logout
 */
export default function DashboardHeader() {
  return (
    <div className={`${COLOR_CLASSES.BG_DARK} border-b ${COLOR_CLASSES.BORDER} px-8 py-4`}>
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">Admin dashboard</h1>
        <div className="flex items-center gap-4">
          <button className={`relative p-2 hover:bg-[#1e293b] rounded-lg transition-colors`}>
            <Bell size={20} className={COLOR_CLASSES.TEXT_MUTED} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f59e0b] rounded-full"></span>
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] rounded-lg transition-colors`}>
            <LogOut size={18} className={COLOR_CLASSES.TEXT_MUTED} />
            <span className="text-white text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
