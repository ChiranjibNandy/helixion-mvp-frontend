"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-bgMain flex text-textPrimary selection:bg-primary/30 selection:text-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <Topbar />
        
        {/* Main Workspace Area */}
        <main className="flex-1 overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
