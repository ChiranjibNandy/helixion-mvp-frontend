import { createApiClient } from "@/lib/api";

export const loginUser = async (data: any) => {
  const api = createApiClient();
  return (await api.post("/auth/login", data)).data;
};

export const registerUser = async (data: any) => {
  const api = createApiClient();
  return (await api.post("/auth/register", data)).data;
};