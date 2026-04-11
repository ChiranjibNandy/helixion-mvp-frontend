// User-related types for admin operations

import { UserRole } from '@/constants/roles';

/**
 * User data structure for admin operations
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  approvalStatus: 'pending' | 'approved' | 'denied';
  createdAt: string;
  updatedAt?: string;
}

/**
 * Payload for updating a user's role
 */
export interface UpdateUserRolePayload {
  role: UserRole;
  approvalStatus?: 'approved' | 'denied';
}

/**
 * API response for user update operations
 */
export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data?: User;
}

/**
 * Props for the Approve User Modal component
 */
export interface ApproveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  onApprove: (userId: string, role: UserRole) => Promise<void>;
}

/**
 * Props for the Role Dropdown component
 */
export interface RoleDropdownProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Hook return type for useUpdateUserRole
 */
export interface UseUpdateUserRoleReturn {
  updateRole: (userId: string, payload: UpdateUserRolePayload) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Registration with approval capability
 * Extends the existing FormattedRegistration with approval status
 */
export interface ApprovableRegistration {
  id: string;
  name: string;
  email: string;
  date: string;
  approvalStatus: 'pending' | 'approved' | 'denied';
}
