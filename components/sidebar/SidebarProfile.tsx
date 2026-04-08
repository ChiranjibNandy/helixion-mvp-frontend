import type { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SidebarProfileProps {
  user: User;
}

// ─── Role Label Map ───────────────────────────────────────────────────────────
const ROLE_LABEL: Record<User['role'], string> = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Administrator',
};

// ─── Component ────────────────────────────────────────────────────────────────
export function SidebarProfile({ user }: SidebarProfileProps) {
  return (
    <div className="px-3.5 py-3 border-b border-white/[0.06]">
      <Avatar initials={user.name.split('')[0]} size="md" className="mb-2" />
      <p className="text-[12px] font-semibold text-slate-200 leading-tight">
        {user.name}
      </p>
      <p className="text-[10px] text-white/30 mt-0.5">
        {user.location}
      </p>
      <p className="text-[9px] text-white/20 mt-0.5">
        {ROLE_LABEL[user.role]}
      </p>
    </div>
  );
}