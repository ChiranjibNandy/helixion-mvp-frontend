import API from './api';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { AxiosResponse } from 'axios';

interface AuthApiResponse {
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
 * Login API endpoint
 */
export const loginAPI = (data: LoginCredentials): Promise<AxiosResponse<AuthApiResponse>> =>
  API.post('auth/login', data);

/**
 * Registration API endpoint
 */
export const registerAPI = (data: RegisterCredentials): Promise<AxiosResponse<AuthApiResponse>> =>
  API.post('auth/register', data);