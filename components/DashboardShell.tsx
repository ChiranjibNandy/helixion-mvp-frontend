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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-md transition-all duration-300">
        <div className="relative overflow-hidden bg-surface border border-borderCard rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          <div className="relative mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-accentYellow/10 border border-accentYellow/20 text-accentYellow animate-pulse">
            <KeyRound className="size-6" />
          </div>
          
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-2 font-sans">
            {t('dashboardShell.sessionExpired.title')}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-8 max-w-[280px]">
            {t('dashboardShell.sessionExpired.description')}
          </p>

          <Button
            onClick={handleSignOut}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center gap-2 py-4"
          >
            <LogOut className="size-4" />
            {t('dashboardShell.sessionExpired.action')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 grid grid-cols-[180px_1fr] overflow-hidden bg-bgMain font-sans">
      <Sidebar
        user={user}
        navSections={navSections}
        activeKey={activeKey}
        onNavChange={setActiveKey}
        onSignOut={handleSignOut}
      />

      <div className="flex flex-col overflow-hidden min-h-0">
        <DashboardHeader user={user} />

        <main className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          {errorStatus === 403 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
              <div className="relative overflow-hidden bg-surface border border-borderCard rounded-2xl p-8 max-w-lg w-full shadow-lg flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="relative mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
                  <ShieldAlert className="size-6" />
                </div>
                
                <h2 className="text-xl font-bold text-foreground tracking-tight mb-2 font-sans">
                  {t('dashboardShell.accessDenied.title')}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mb-8">
                  {t('dashboardShell.accessDenied.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <Button
                    variant="outline"
                    onClick={handleGoBack}
                    className="flex items-center justify-center gap-1.5 border-border hover:bg-muted text-foreground font-medium"
                  >
                    <ArrowLeft className="size-3.5" />
                    {t('dashboardShell.accessDenied.goBack')}
                  </Button>

                  <Button
                    onClick={handleGoToDashboard}
                    className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
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