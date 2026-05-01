import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/admin';

export const userService = {
  searchUsers: async (query: string = '', limit: number = 10) => {
    const response = await api.get(`${API_ENDPOINTS.USERS}?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  deactivateUser: async (id: string) => {
    const response = await api.patch(API_ENDPOINTS.DEACTIVATE_USER(id));
    return response.data;
  }
};
