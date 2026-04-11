// Admin service for user management API operations

import API from '@/lib/api';
import { UpdateUserRolePayload, UpdateUserResponse } from '@/types/user.types';
import { parseApiError } from '@/utils/parseError';

/**
 * API endpoint for admin user operations
 */
const ADMIN_ENDPOINTS = {
  USERS: '/admin/users',
} as const;

/**
 * Update a user's role and/or approval status
 * 
 * @param userId - The ID of the user to update
 * @param payload - The update payload containing role and optional approval status
 * @returns Promise resolving to the update response
 * @throws Error with user-friendly message if the request fails
 */
export async function updateUserRole(
  userId: string,
  payload: UpdateUserRolePayload
): Promise<UpdateUserResponse> {
  try {
    const response = await API.patch<UpdateUserResponse>(
      `${ADMIN_ENDPOINTS.USERS}/${userId}`,
      payload
    );

    return response.data;
  } catch (error) {
    const parsedError = parseApiError(error);
    throw new Error(parsedError.message);
  }
}

/**
 * Approve a pending user registration with a specific role
 * 
 * @param userId - The ID of the user to approve
 * @param role - The role to assign to the user
 * @returns Promise resolving to the update response
 * @throws Error with user-friendly message if the request fails
 */
export async function approveUser(
  userId: string,
  role: UpdateUserRolePayload['role']
): Promise<UpdateUserResponse> {
  return updateUserRole(userId, {
    role,
    approvalStatus: 'approved',
  });
}

/**
 * Deny a pending user registration
 * 
 * @param userId - The ID of the user to deny
 * @returns Promise resolving to the update response
 * @throws Error with user-friendly message if the request fails
 */
export async function denyUser(userId: string): Promise<UpdateUserResponse> {
  try {
    const response = await API.patch<UpdateUserResponse>(
      `${ADMIN_ENDPOINTS.USERS}/${userId}`,
      {
        approvalStatus: 'denied',
      }
    );

    return response.data;
  } catch (error) {
    const parsedError = parseApiError(error);
    throw new Error(parsedError.message);
  }
}
