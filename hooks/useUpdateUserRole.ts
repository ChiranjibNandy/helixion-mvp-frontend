'use client';

import { useState, useCallback, useRef } from 'react';
import { approveUser } from '@/services/admin.service';
import { UserRole, DEFAULT_APPROVAL_ROLE } from '@/constants/roles';
import { UpdateUserRolePayload } from '@/types/user.types';
import { UseUpdateUserRoleReturn } from '@/types/user.types';
import { NETWORK_ERRORS } from '@/constants/errors';


export function useUpdateUserRole(
  onSuccess?: (userId: string, role: UserRole) => void,
  onError?: (userId: string, error: string) => void
): UseUpdateUserRoleReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track pending requests to prevent duplicate submissions
  const pendingRequests = useRef<Set<string>>(new Set());

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Update a user's role with optimistic UI handling
   * 
   * @param userId - The ID of the user to update
   * @param payload - The update payload containing role and optional approval status
   */
  const updateRole = useCallback(
    async (userId: string, payload: UpdateUserRolePayload): Promise<void> => {
      // Prevent duplicate submissions for the same user
      if (pendingRequests.current.has(userId)) {
        return;
      }

      // Validate payload
      if (!payload.role) {
        setError('Please select a valid role');
        onError?.(userId, 'Please select a valid role');
        return;
      }

      pendingRequests.current.add(userId);
      setLoading(true);
      setError(null);

      // Store previous state for potential rollback
      const previousState = {
        userId,
        role: payload.role,
      };

      try {
        await approveUser(userId, payload.role);
        
        // Success - notify parent
        onSuccess?.(userId, payload.role);
      } catch (err) {
        // Extract user-friendly error message
        const errorMessage = err instanceof Error 
          ? err.message 
          : NETWORK_ERRORS.UNKNOWN_ERROR;

        // Set error state
        setError(errorMessage);
        
        // Notify parent of failure for rollback
        onError?.(userId, errorMessage);

        // Re-throw to allow caller to handle if needed
        throw err;
      } finally {
        pendingRequests.current.delete(userId);
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  return {
    updateRole,
    loading,
    error,
    clearError,
  };
}

/**
 * Hook specifically for approving users with role assignment
 * Convenience wrapper around useUpdateUserRole
 */
export function useApproveUser(
  onSuccess?: (userId: string, role: UserRole) => void,
  onError?: (userId: string, error: string) => void
): {
  approve: (userId: string, role: UserRole) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
} {
  const { updateRole, loading, error, clearError } = useUpdateUserRole(
    onSuccess,
    onError
  );

  const approve = useCallback(
    async (userId: string, role: UserRole = DEFAULT_APPROVAL_ROLE): Promise<void> => {
      await updateRole(userId, {
        role,
        approvalStatus: 'approved',
      });
    },
    [updateRole]
  );

  return {
    approve,
    loading,
    error,
    clearError,
  };
}
