'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState } from '@/types/auth';
import { ROUTES } from '@/constants/navigation';
import { USER_ROLES } from '@/constants/navigation';
import { getAccessToken, removeAccessToken } from '@/utils/token';

interface UseAuthReturn extends AuthState {
  checkAuth: () => Promise<boolean>;
  logout: () => void;
}

/**
 * Hook for managing authentication state
 * Checks token validity and user role
 */
export function useAuth(requireAdmin: boolean = false): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const token = getAccessToken();

      if (!token) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }

      // Decode token to get user info (basic JWT decode)
      const payload = decodeToken(token);
      
      if (!payload) {
        removeAccessToken();
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }

      // Check token expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        removeAccessToken();
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }

      const user: User = {
        id: payload.sub || '',
        username: payload.username || '',
        email: payload.email || '',
        role: payload.role || USER_ROLES.USER,
      };

      // Check admin requirement
      if (requireAdmin && user.role !== USER_ROLES.ADMIN) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }

      setState({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      removeAccessToken();
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  }, [requireAdmin]);

  const logout = useCallback(() => {
    removeAccessToken();
    setState({ user: null, isAuthenticated: false, isLoading: false });
    router.push(ROUTES.SIGNIN);
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    checkAuth,
    logout,
  };
}

/**
 * Decode JWT token without verification
 * NOTE: This is for client-side role checking only
 * Actual verification happens on the server
 */
function decodeToken(token: string): { 
  sub?: string; 
  username?: string; 
  email?: string; 
  role?: typeof USER_ROLES.ADMIN | typeof USER_ROLES.USER;
  exp?: number;
} | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Hook specifically for admin authorization
 * Redirects non-admin users to signin page
 */
export function useAdminAuth(): UseAuthReturn {
  const router = useRouter();
  const auth = useAuth(true);

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push(ROUTES.SIGNIN);
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}
