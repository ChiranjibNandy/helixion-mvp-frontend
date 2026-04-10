'use client';

import { useMemo } from 'react';
import { RoleDropdownProps } from '@/types/user.types';
import { ASSIGNABLE_ROLES, getRoleLabel, UserRole } from '@/constants/roles';
import Select from '@/components/ui/Select';

/**
 * RoleDropdown - A specialized select component for user role selection
 * Enhances the base Select component with domain-specific role data.
 */
export default function RoleDropdown({
  value,
  onChange,
  disabled = false,
  className = '',
}: RoleDropdownProps) {
  // Memoize options to avoid mapping on every render
  const roleOptions = useMemo(() => 
    ASSIGNABLE_ROLES.map((role) => ({
      value: role,
      label: getRoleLabel(role),
    })), 
  []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as UserRole);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      options={roleOptions}
      className={className}
      aria-label="Select role"
    />
  );
}
