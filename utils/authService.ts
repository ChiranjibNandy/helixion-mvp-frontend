import { api } from "@/lib/api";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";

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

export const loginAPI = (data: LoginCredentials): Promise<AxiosResponse<AuthApiResponse>> => {
  return api.post("/auth/login", data);
};

export const registerAPI = (data: RegisterCredentials): Promise<AxiosResponse<AuthApiResponse>> => {
  return api.post("/auth/register", data);
};




