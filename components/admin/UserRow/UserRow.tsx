"use client";

import { User } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  getAvatarColor,
  getInitials,
  formatRegistrationDate,
} from "@/utils/userUtils";

interface UserRowProps {
  user: User;
  selected: boolean;
  onToggleSelect: (userId: string) => void;
  onApprove: (user: User) => void;
  onDeny: (userId: string) => void;
}

export function UserRow({
  user,
  selected,
  onToggleSelect,
  onApprove,
  onDeny,
}: UserRowProps) {
  const initials = getInitials(user.name);
  const avatarColor = getAvatarColor(user.name);
  const registeredDate = formatRegistrationDate(user.createdAt);

  // Map backend status to visual status badge variant
  const getStatusVariant = (status: string) => {
    if (status === "active") return "active";
    if (status === "pending") return "pending";
    return "inactive"; // For 'denied' or others
  };

  const getStatusLabel = (status: string) => {
    if (status === "active") return "Active";
    if (status === "pending") return "Pending";
    return "Inactive";
  };

  const formatRole = (role?: string) => {
    if (!role) return <span className="text-textMuted italic">Not assigned</span>;
    const roleDisplay = role.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());
    
    if (role === "employee") return <span className="text-accentBlue font-medium">{roleDisplay}</span>;
    if (role === "training_provider") return <span className="text-statusActive font-medium">{roleDisplay}</span>;
    if (role === "manager") return <span className="text-roleManager font-medium">{roleDisplay}</span>;
    if (role === "admin") return <span className="text-textPrimary font-bold">{roleDisplay}</span>;
    return <span className="text-textSecondary">{roleDisplay}</span>;
  };

  return (
    <tr className="border-b border-borderDark hover:bg-bgHover/30 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <Checkbox
          checked={selected}
          onChange={() => onToggleSelect(user.id)}
          aria-label={`Select ${user.name}`}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: avatarColor }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-textPrimary">{user.name}</span>
            <span className="text-xs text-textMuted">{user.email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={getStatusVariant(user.status)} label={getStatusLabel(user.status)} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatRole(user.role)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textMuted">
        {registeredDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <div className="flex items-center justify-end gap-2">
          {user.status === "pending" ? (
            <>
              <Button size="sm" variant="outline-success" onClick={() => onApprove(user)}>
                Approve
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => onDeny(user.id)}>
                Deny
              </Button>
            </>
          ) : user.status === "active" ? (
            <Button size="sm" variant="outline-danger" className="border-borderDark text-textMuted hover:text-statusInactive">
              Deactivate
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="border-borderDark hover:text-textPrimary">
              Reactivate
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
