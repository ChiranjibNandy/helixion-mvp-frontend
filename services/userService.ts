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
export type BulkUploadJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface BulkUploadJob {
  jobId: string;
  status: BulkUploadJobStatus;
  totalRows: number;
  processedRows: number;
  progress: number;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  skippedEmails: string[];
  skipped?: SkippedRow[];
  error?: string;
}

export const userService = {
  searchUsers: async (query: string = '', page: number = 1, limit: number = 10) => {
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

  batchCreateUsersAsync: async (file: File): Promise<{ jobId: string; statusUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API.ADMIN.BATCH_CREATE_ASYNC, formData);
    return response.data?.data;
  },

  getBatchUploadJobStatus: async (jobId: string): Promise<BulkUploadJob> => {

    const response = await api.get(API.ADMIN.BATCH_CREATE_STATUS(jobId), { timeout: 10_000 });
    const data = response.data?.data;

    if (!data) throw new Error('Malformed response from upload status endpoint');
    return data;
  },
};
