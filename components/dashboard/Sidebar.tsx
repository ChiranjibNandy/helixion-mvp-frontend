'use client';

import { LayoutDashboard, BarChart3, Users, Shield, FileText, Settings, Zap, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

function NavItem({ icon, label, badge, isActive }: NavItemProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
      isActive ? 'bg-[#1e293b] text-white' : 'text-[#9ca3af] hover:bg-[#1e293b]/50 hover:text-white'
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5">{icon}</div>
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

interface SidebarProps {
  pendingCount?: number;
  totalUsers?: number;
}

export default function Sidebar({ pendingCount = 0, totalUsers = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#0a0f1e] border-r border-[#1a2235] h-screen flex flex-col">
      <div className="p-6 border-b border-[#1a2235]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">He</span>
          </div>
          <span className="text-white font-semibold text-lg">Helixion</span>
        </div>
      </div>

      <div className="flex-1 px-3 py-6">
        <div className="mb-6">
          <div className="text-[#6b7280] text-xs font-semibold uppercase tracking-wider px-4 mb-3">
            Overview
          </div>
          <div className="space-y-1">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" isActive={true} />
            <NavItem icon={<BarChart3 size={20} />} label="Analytics" href="/analytics" />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[#6b7280] text-xs font-semibold uppercase tracking-wider px-4 mb-3">
            Management
          </div>
          <div className="space-y-1">
            <NavItem icon={<Users size={20} />} label="Pending" href="/pending" badge={pendingCount.toString()} />
            <NavItem icon={<Users size={20} />} label="All users" href="/users" badge={totalUsers.toString()} />
            <NavItem icon={<Shield size={20} />} label="Roles & permissions" href="/roles" />
            <NavItem icon={<FileText size={20} />} label="Bulk import" href="/import" />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[#6b7280] text-xs font-semibold uppercase tracking-wider px-4 mb-3">
            Platform
          </div>
          <div className="space-y-1">
            <NavItem icon={<Settings size={20} />} label="Programs" href="/programs" />
            <NavItem icon={<Zap size={20} />} label="Organizations" href="/organizations" />
            <NavItem icon={<Bell size={20} />} label="Audit log" href="/audit" />
          </div>
        </div>

        <div>
          <div className="text-[#6b7280] text-xs font-semibold uppercase tracking-wider px-4 mb-3">
            General tools
          </div>
          <div className="space-y-1">
            <NavItem icon={<Settings size={20} />} label="Support" href="/support" />
            <NavItem icon={<Bell size={20} />} label="Integrations" href="/integrations" />
            <NavItem icon={<Bell size={20} />} label="Notifications" href="/notifications" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#1a2235]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AD</span>
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">Admin</div>
            <div className="text-[#6b7280] text-xs">View profile</div>
          </div>
        </div>
      </div>
    </div>
  );
}
