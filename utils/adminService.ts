import { API } from "@/constants/api";
import { api } from "@/lib/api";

export const getUsersAPI = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return await api.get(API.ADMIN.USERS, {
    params,
  });
};