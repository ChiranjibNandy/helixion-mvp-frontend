import { api } from "@/lib/api";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";
import { signinSchema, signupSchema } from "@/validations/auth";

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

//login the user

export const loginAPI = async (data: { email: string; password: string }) => {
  const parsed = signinSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    });

    throw fieldErrors;
  }

  return await api.post("/auth/login", data);
};

//Registration of user

export const registerAPI = async (data: RegisterCredentials) => {
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    });

    throw fieldErrors; 
  }

  return await api.post('/auth/register', data);
};




