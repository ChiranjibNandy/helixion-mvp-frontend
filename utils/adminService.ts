import { api } from "@/lib/api";

export const getUsersAPI = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return await api.get("/admin/users", {
    params,
  });
};