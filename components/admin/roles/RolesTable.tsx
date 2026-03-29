"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getAvatarColor, getInitials, formatRegistrationDate } from "@/utils/userUtils";
import { cn } from "@/lib/utils";
import { useRegistrations } from "@/hooks/useRegistrations";

const ROLES = [
  { value: "employee", label: "Employee" },
  { value: "training_provider", label: "Training Provider" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

export function RolesTable() {
  const { data, isLoading, selectedUsers, handleToggleSelect, handleToggleSelectAll } = useRegistrations("active");

  const isAllSelected = !!data?.users.length && selectedUsers.size === data.users.length;

  return (
    <div className="bg-bgCard border border-borderDark rounded-xl overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-borderDark bg-bgMain/30">
        <h2 className="text-base font-medium text-textPrimary tracking-tight">
          Active users - role management
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-borderDark">
              <th className="px-6 py-4 w-12 text-sm font-semibold text-textMuted tracking-tight">
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Current role</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Change role</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Last active</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-textMuted">
                  Loading active users...
                </td>
              </tr>
            ) : !data || data.users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-textMuted">
                  No active users found.
                </td>
              </tr>
            ) : (
              data.users.map((user) => (
                <tr key={user.id} className="border-b border-borderDark hover:bg-bgHover/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleToggleSelect(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: getAvatarColor(user.name) }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-textPrimary">{user.name}</span>
                        <span className="text-xs text-textMuted">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "text-sm font-medium",
                      user.role === 'employee' ? 'text-accentBlue' :
                      user.role === 'training_provider' ? 'text-statusActive' :
                      user.role === 'manager' ? 'text-roleManager' : 'text-textPrimary'
                    )}>
                      {ROLES.find(r => r.value === user.role)?.label || "Unassigned"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="h-9 w-full sm:w-[180px] rounded-md border border-borderDark bg-inputBg px-3 py-1.5 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentBlue appearance-none"
                      defaultValue={user.role}
                    >
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textMuted">
                    {formatRegistrationDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="default" className="h-8">
                        Save change
                      </Button>
                      <Button size="sm" variant="outline-danger" className="h-8">
                        Deactivate
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
