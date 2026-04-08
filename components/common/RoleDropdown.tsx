'use client';

import { ChevronDown } from 'lucide-react';
import { RoleDropdownProps } from '@/types/user.types';
import { ASSIGNABLE_ROLES, getRoleLabel, UserRole } from '@/constants/roles';

// Reusable dropdown component for role selection
export default function RoleDropdown({
  value,
  onChange,
  disabled = false,
  className = '',
}: RoleDropdownProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = event.target.value as UserRole;
    onChange(selectedRole);
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full
          appearance-none
          bg-bgStatCard
          border
          border-borderCard
          rounded-lg
          px-4
          py-3
          pr-10
          text-white
          text-sm
          focus:outline-none
          focus:border-primary
          focus:ring-1
          focus:ring-primary
          transition-colors
          disabled:opacity-50
          disabled:cursor-not-allowed
        `}
        aria-label="Select role"
      >
        {ASSIGNABLE_ROLES.map((role) => (
          <option 
            key={role} 
            value={role}
            className="bg-bgStatCard text-white"
          >
            {getRoleLabel(role)}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown 
          size={16} 
          className={`text-textSidebarMuted ${disabled ? 'opacity-50' : ''}`} 
        />
      </div>
    </div>
  );
}
