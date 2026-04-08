

import { createApiClient } from "@/lib/api";

export const loginAPI = (data: {
  email: string;
  password: string;
}) => {
  const api = createApiClient();
  return api.post("/auth/login", data);
};

export const registerAPI = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const api = createApiClient();
  return api.post("/auth/register", data);
};