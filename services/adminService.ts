import { API } from "@/constants/api";
import { api } from "@/lib/api";
import { approveUserSchema } from "@/validations/admin";

//using reset password- all user list
export const getUsersAPI = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return await api.get(API.ADMIN.USERS, {
    params,
  });
};

//using to approve and assign role of pending user list in admin
export const getPendingUserAPI = async () => {
  return await api.get(API.ADMIN.REGISTRATIONS)
}

//approve the user and assign role
export const approveUserAPI = async (data: { userId: string, role: string }) => {
  const parsed = approveUserSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  const { userId, role } = parsed.data;

  return await api.patch(`${ API.ADMIN.USERS }/${ userId }`, {
    role,
  });
};