'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/types';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { Sidebar } from './ui/sidebar';
import { logoutAPI } from '@/services/authService';
import { removeAccessToken } from '@/utils/token';
import { ROUTES } from '@/constants/navigation';
import { KeyRound, ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';


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
  const pathname = usePathname();
  const [errorStatus, setErrorStatus] = useState<401 | 403 | null>(null);

  const getActiveKeyFromPathname = (path: string) => {
    if (!path) return defaultActiveKey;
    const allItems = navSections.flatMap((section: any) => section.items || []);
    const sortedItems = [...allItems].sort((a: any, b: any) => (b.href?.length || 0) - (a.href?.length || 0));
    
    const activeItem = sortedItems.find((item: any) => {
      if (!item.href) return false;
      if (item.href === '/dashboard' || item.href === '/admin/dashboard') {
        return path === item.href;
      }
      return path.startsWith(item.href);
    });

    return activeItem ? activeItem.key : defaultActiveKey;
  };

  const [activeKey, setActiveKey] = useState<string>(() => getActiveKeyFromPathname(pathname));

  useEffect(() => {
    setActiveKey(getActiveKeyFromPathname(pathname));
  }, [pathname, navSections, defaultActiveKey]);

  useEffect(() => {
    const handle401 = () => setErrorStatus(401);
    const handle403 = () => setErrorStatus(403);

    if (typeof window !== "undefined") {
      window.addEventListener("api-unauthorized", handle401);
      window.addEventListener("api-forbidden", handle403);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("api-unauthorized", handle401);
        window.removeEventListener("api-forbidden", handle403);
      }
    };
  }, []);

  useEffect(() => {
    setErrorStatus(null);
  }, [pathname]);

  const handleGoToDashboard = () => {
    setErrorStatus(null);
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoBack = () => {
    setErrorStatus(null);
    router.back();
  };

  async function handleSignOut() {
    try {
      await logoutAPI();
    } catch {
      // proceed with local cleanup even if backend call fails
    }
    await removeAccessToken();
    router.push(ROUTES.AUTH.SIGNIN);
  }

  if (errorStatus === 401) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md transition-all duration-300">
        <div className="relative overflow-hidden bg-[#0d1527]/80 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_0_rgba(0,0,0,0.5)] flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          
          <div className="relative mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_20px_0_rgba(245,158,11,0.15)] animate-pulse">
            <KeyRound className="size-6" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-2 font-sans">
            {t('dashboardShell.sessionExpired.title')}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-8 max-w-[280px]">
            {t('dashboardShell.sessionExpired.description')}
          </p>

          <Button
            onClick={handleSignOut}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-[0_4px_20px_0_rgba(37,99,235,0.25)] border border-blue-500/20 flex items-center justify-center gap-2 py-4"
          >
            <LogOut className="size-4" />
            {t('dashboardShell.sessionExpired.action')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[180px_1fr] min-h-screen bg-[#0b1120] font-sans">
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
          {errorStatus === 403 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
              <div className="relative overflow-hidden bg-[#0d1527]/40 border border-white/[0.06] backdrop-blur-lg rounded-2xl p-8 max-w-lg w-full shadow-lg flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-red-600/5 rounded-full blur-2xl" />
                
                <div className="relative mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_20px_0_rgba(239,68,68,0.15)]">
                  <ShieldAlert className="size-6" />
                </div>
                
                <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-2 font-sans">
                  {t('dashboardShell.accessDenied.title')}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-8">
                  {t('dashboardShell.accessDenied.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <Button
                    variant="outline"
                    onClick={handleGoBack}
                    className="flex items-center justify-center gap-1.5 border-white/10 hover:bg-white/5 text-slate-300 font-medium"
                  >
                    <ArrowLeft className="size-3.5" />
                    {t('dashboardShell.accessDenied.goBack')}
                  </Button>

                  <Button
                    onClick={handleGoToDashboard}
                    className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium border border-blue-500/20 shadow-[0_4px_15px_0_rgba(37,99,235,0.15)]"
                  >
                    <Home className="size-3.5" />
                    {t('dashboardShell.accessDenied.dashboardHome')}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}