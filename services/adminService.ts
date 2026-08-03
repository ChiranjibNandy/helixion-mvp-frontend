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

// whether an org (with a saved policy) exists yet — drives sidebar gating
// for org-dependent screens like Bulk Import (ticket 0041)
export const getOrganizationStatusAPI = async () => {
  return await api.get(API.ADMIN.ORGANIZATIONS_STATUS);
};

// create a new organization with its full policy schedule in one step
export const createOrganizationAPI = async (payload: unknown) => {
  return await api.post(API.ADMIN.ORGANIZATIONS, payload);
};

// bulk-create organizations from a CSV (same field name as the training
// provider's program bulk-upload — the multer middleware expects "file")
export const bulkUploadOrganizationsAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return await api.post(API.ADMIN.ORGANIZATIONS_BULK, formData);
};