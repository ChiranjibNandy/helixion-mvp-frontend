'use client';

import { useRegistrations } from '@/hooks/useRegistrations';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import DashboardHeader from '@/components/dashboard/layout/DashboardHeader';
import StatCard from '@/components/dashboard/ui/StatCard';
import PendingRegistrations from '@/components/dashboard/features/PendingRegistrations';
import RecentActivity from '@/components/dashboard/features/RecentActivity';
import { COLOR_CLASSES, UI_MESSAGES } from '@/constants/admin';
import { Activity } from '@/types/admin';

/**
 * Main admin dashboard page with production-level architecture
 */
export default function AdminDashboard() {
  const { registrations, loading, error } = useRegistrations();
  
  const recentActivities: Activity[] = [];
  
  // Handle error state
  if (error) {
    return (
      <div className={`flex h-screen ${COLOR_CLASSES.BG_MAIN}`}>
        <Sidebar pendingCount={0} totalUsers={0} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${COLOR_CLASSES.BG_MAIN}`}>
      <Sidebar pendingCount={registrations.length} totalUsers={registrations.length} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Stats Section */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total users" 
                value="-" 
                subtitle={UI_MESSAGES.DATA_UNAVAILABLE}
                subtitleColor={COLOR_CLASSES.TEXT_MUTED}
              />
              <StatCard 
                title="Pending approval" 
                value={registrations.length} 
                subtitle={UI_MESSAGES.NEEDS_ACTION}
                subtitleColor={COLOR_CLASSES.TEXT_WARNING}
              />
              <StatCard 
                title="Active today" 
                value="-" 
                subtitle={UI_MESSAGES.DATA_UNAVAILABLE}
                subtitleColor={COLOR_CLASSES.TEXT_MUTED}
              />
              <StatCard 
                title="Deactivated" 
                value="-" 
                subtitle={UI_MESSAGES.ALL_TIME}
                subtitleColor={COLOR_CLASSES.TEXT_MUTED}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                {loading ? (
                  <div className={`${COLOR_CLASSES.BG_CARD} rounded-lg border ${COLOR_CLASSES.BORDER} p-6 flex items-center justify-center h-[400px]`}>
                    <div className={COLOR_CLASSES.TEXT_MUTED}>{UI_MESSAGES.LOADING_REGISTRATIONS}</div>
                  </div>
                ) : (
                  <PendingRegistrations registrations={registrations} />
                )}
              </div>
              <div>
                <RecentActivity activities={recentActivities} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
