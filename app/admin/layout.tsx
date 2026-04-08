'use client';

import { useAdminAuth } from '@/hooks/useAuth';
import { COLOR_CLASSES, UI_MESSAGES } from '@/constants/admin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout with role-based authorization
 * Only admin users can access child routes
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isLoading, isAuthenticated } = useAdminAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className={`flex h-screen ${COLOR_CLASSES.BG_MAIN} items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className={COLOR_CLASSES.TEXT_MUTED}>{UI_MESSAGES.LOADING}</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the hook will redirect to signin
  // This prevents rendering admin content for unauthorized users
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
