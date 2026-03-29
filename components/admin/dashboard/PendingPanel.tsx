import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAvatarColor, getInitials } from "@/utils/userUtils";

import type { User } from "@/types/registration";
import { formatRegistrationDate } from "@/utils/userUtils";

interface PendingPanelProps {
  users?: User[];
  isLoading?: boolean;
}

export function PendingPanel({ users = [], isLoading }: PendingPanelProps) {
  return (
    <div className="bg-bgCard border border-borderDark rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-textPrimary tracking-tight">
          Pending registrations
        </h3>
        <Link 
          href="/admin/users" 
          className="text-xs text-accentBlue hover:text-blue-400 font-medium transition-colors"
        >
          View all &rarr;
        </Link>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {isLoading ? (
          <div className="text-sm text-textMuted flex items-center justify-center p-4">Loading data...</div>
        ) : users.length === 0 ? (
          <div className="text-sm text-textMuted flex items-center justify-center p-4">No pending registrations.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3 w-[200px]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: getAvatarColor(user.name) }}
              >
                {getInitials(user.name)}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium text-textPrimary truncate">
                  {user.name}
                </span>
                <span className="text-xs text-textMuted truncate">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="text-xs text-textMuted hidden sm:block w-[60px] text-right">
              {formatRegistrationDate(user.createdAt)}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline-success" size="sm" className="h-7 px-2.5 text-xs font-medium tracking-tight">
                Approve
              </Button>
              <Button variant="outline-danger" size="sm" className="h-7 px-2.5 text-xs font-medium tracking-tight">
                Deny
              </Button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
