'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Users, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BulkUser } from '@/types/bulk-import';

interface StepAssignRolesProps {
  users: BulkUser[];
  onRolesAssigned: (users: BulkUser[]) => void;
  onBack: () => void;
}

const AVAILABLE_ROLES = [
  { value: 'employee', label: 'Employee', description: 'Standard user with basic access' },
  { value: 'reporting_manager', label: 'Reporting Manager', description: 'Can view reports and manage teams' },
  { value: 'training_admin', label: 'Training Admin', description: 'Can manage training programs' },
];

export default function StepAssignRoles({ users, onRolesAssigned, onBack }: StepAssignRolesProps) {
  const [localUsers, setLocalUsers] = useState<BulkUser[]>(() => [...users]);
  const [bulkRole, setBulkRole] = useState('');
  const [showBulkDropdown, setShowBulkDropdown] = useState(false);

  const unassignedCount = localUsers.filter((u) => !u.role).length;
  const assignedCount = localUsers.length - unassignedCount;

  const handleBulkAssign = (role: string) => {
    setLocalUsers((prev) =>
      prev.map((u) => (u.role ? u : { ...u, role }))
    );
    setBulkRole(role);
    setShowBulkDropdown(false);
  };

  const handleIndividualRole = (rowId: string, role: string) => {
    setLocalUsers((prev) =>
      prev.map((u) => (u._rowId === rowId ? { ...u, role } : u))
    );
  };

  const handleApplyToAll = (role: string) => {
    setLocalUsers((prev) => prev.map((u) => ({ ...u, role })));
    setBulkRole(role);
    setShowBulkDropdown(false);
  };

  const canProceed = localUsers.every((u) => u.role && u.role.trim().length > 0);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="text-primary" size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Assign Roles</h2>
              <p className="text-xs text-textSidebarMuted mt-0.5">
                Assign a role to each user before importing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accentGreen/10 border border-accentGreen/20">
              <CheckCircle2 size={12} className="text-accentGreen" />
              <span className="text-xs font-medium text-accentGreen">{assignedCount} assigned</span>
            </div>
            {unassignedCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accentOrange/10 border border-accentOrange/20">
                <AlertTriangle size={12} className="text-accentOrange" />
                <span className="text-xs font-medium text-accentOrange">{unassignedCount} unassigned</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Assign Section */}
      <div className="px-6 py-4 bg-white/[0.01] border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">Bulk Role Assignment</p>
            <p className="text-xs text-white/30 mt-0.5">Apply a role to all unassigned users at once</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowBulkDropdown(!showBulkDropdown)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 bg-white/5
                         rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
              id="bulk-role-dropdown-btn"
            >
              {bulkRole ? AVAILABLE_ROLES.find(r => r.value === bulkRole)?.label : 'Select role for all'}
              <ChevronDown size={14} className={`transition-transform ${showBulkDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showBulkDropdown && (
              <div className="absolute right-0 top-full mt-2 z-20 w-72 bg-bgSidebar border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {AVAILABLE_ROLES.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => handleApplyToAll(role.value)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.03] last:border-b-0"
                  >
                    <p className="text-sm font-medium text-white/80">{role.label}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{role.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">#</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Username</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider w-56">Role</th>
            </tr>
          </thead>
          <tbody>
            {localUsers.map((user, idx) => (
              <tr
                key={user._rowId}
                className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-6 py-3">
                  <span className="text-xs text-white/20 font-mono">{idx + 1}</span>
                </td>
                <td className="px-6 py-3">
                  <span className="text-xs text-white/80">{user.username}</span>
                </td>
                <td className="px-6 py-3">
                  <span className="text-xs text-white/60 font-mono">{user.email}</span>
                </td>
                <td className="px-6 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleIndividualRole(user._rowId, e.target.value)}
                    className={`
                      w-full text-xs px-3 py-2 rounded-lg border transition-all duration-200
                      bg-white/5 focus:outline-none focus:ring-1 focus:ring-primary
                      ${user.role
                        ? 'border-accentGreen/30 text-white/80'
                        : 'border-accentOrange/30 text-white/40'
                      }
                    `}
                  >
                    <option value="" className="bg-bgSidebar text-white/40">Select role...</option>
                    {AVAILABLE_ROLES.map((role) => (
                      <option key={role.value} value={role.value} className="bg-bgSidebar text-white">
                        {role.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between p-6 border-t border-white/5 mt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/50 bg-white/5
                     rounded-lg hover:bg-white/10 transition-all duration-200"
          id="roles-back-btn"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          onClick={() => onRolesAssigned(localUsers)}
          disabled={!canProceed}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white
                     bg-primary rounded-lg hover:bg-primaryDark transition-all duration-200
                     shadow-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          id="roles-next-btn"
        >
          Review & Confirm
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
