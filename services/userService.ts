import { API } from '@/constants/api';
import { api } from '@/lib/api';


export interface SkippedRow {
  email?: string;
  employeeCode?: string;
  error: string;
}

export interface BatchCreateResponse {
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  skippedEmails: string[];
  skipped?: SkippedRow[];
}

export const userService = {
  searchUsers: async (query: string = '', page: number = 1, limit: number = 10) => {
    // Backend's searchUsersQuerySchema only recognizes "search" — its
    // validate() middleware replaces req.query wholesale with its own
    // parsed output, so a "q" param here was silently dropped and every
    // search returned the unfiltered list.
    const response = await api.get(`${API.ADMIN.USERS_SEARCH}?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  deactivateUser: async (id: string) => {
    const response = await api.patch(API.ADMIN.DEACTIVATE_USER(id));
    return response.data;
  },

  activateUser: async (id: string) => {
    const response = await api.patch(API.ADMIN.ACTIVATE_USER(id));
    return response.data;
  },

  // Sends a real CSV file (built client-side from the preview rows, possibly
  // hand-edited — see BulkImportWizard/rowsToCsvFile) via the same multipart
  // pattern used for org bulk-upload.
  batchCreateUsers: async (file: File): Promise<BatchCreateResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API.ADMIN.BATCH_CREATE, formData);
    return response.data?.data;
  },
};
