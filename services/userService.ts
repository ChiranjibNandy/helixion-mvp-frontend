import { API } from '@/constants/api';
import { api } from '@/lib/api';


export interface BatchCreateResponse {
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  skippedEmails: string[];
}

export const userService = {
  searchUsers: async (query: string = '', page: number = 1, limit: number = 10) => {
    const response = await api.get(`${API.ADMIN.USERS_SEARCH}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  deactivateUser: async (id: string) => {
    const response = await api.patch(API.ADMIN.DEACTIVATE_USER(id));
    return response.data;
  },

  // Sends the raw CSV file — the backend now parses and validates it
  // server-side (name/hierarchy/office-role columns), matching the same
  // multipart pattern used for org bulk-upload. No client-side row parsing
  // or per-row preview anymore, since the backend doesn't return per-row
  // detail to preview against.
  batchCreateUsers: async (file: File): Promise<BatchCreateResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API.ADMIN.BATCH_CREATE, formData);
    return response.data?.data;
  },
};
