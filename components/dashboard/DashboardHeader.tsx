import type { User } from '@/types';
import { MapPin } from 'lucide-react';

interface DashboardHeaderProps {
  user: User;
}


export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="border-b border-r border-white/[0.06] bg-background px-5 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-sm font-semibold text-foreground leading-tight">
          Welcome Back, {user.name}
        </h1>
        {user.location && (
          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin className="size-2.5" />
            {user.location}
          </p>
        )}
      </div>
    </header>
  );
}