import { loginAPI, registerAPI } from '@/lib/auth';
import { setToken } from '@/utils/token';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { AxiosResponse } from 'axios';

interface ApiAuthResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  data?: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
  };
}

/**
 * Authenticate user with credentials
 * Stores token on successful login
 */
export const loginUser = async (data: LoginCredentials): Promise<AuthResponse> => {
  const res: AxiosResponse<ApiAuthResponse> = await loginAPI(data);

  if (res.data.success && res.data.accessToken) {
    setToken(res.data.accessToken);
  }

  return {
    success: res.data.success,
    message: res.data.message,
    accessToken: res.data.accessToken,
    data: res.data.data,
  };
};

/**
 * Register new user account
 */
export const registerUser = async (data: RegisterCredentials): Promise<AuthResponse> => {
  const res: AxiosResponse<ApiAuthResponse> = await registerAPI(data);

  return {
    success: res.data.success,
    message: res.data.message,
    accessToken: res.data.accessToken,
    data: res.data.data,
  };
};