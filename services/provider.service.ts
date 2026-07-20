import { api } from '@/lib/api';
import type { DraftProgram, DraftProgramsResponse } from '@/types';

// ΓöÇΓöÇΓöÇ Bulk Upload ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface BulkUploadError {
  row: number;
  errors: { path: string; message: string }[];
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  data: {
    insertedCount: number;
    failedCount: number;
    errors: BulkUploadError[];
  };
}

export type BulkUploadResult = BulkUploadResponse['data'];

// ΓöÇΓöÇΓöÇ Update Draft Payload ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface UpdateDraftPayload {
  title?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  city?: string;
  singleOccupancyFee?: number;
  twinSharingFee?: number;
  nonResidentialFee?: number;
  brochureUrl?: string;
}

// ─── Dashboard Types ─────────────────────────────────────────────────────────

export interface DashboardOverview {
  livePrograms: number;
  drafts: number;
  totalEnrollments: number;
  averageFillRate: number;
  todayEnrollmentCount: number;
  todayAttendance: number;
}

export interface DashboardTopProgram {
  _id: string;
  title: string;
  startDate: string;
  enrolledCount: number;
  maxParticipants: number;
  fillRate: number;
}

export interface DashboardActivity {
  type: 'published' | 'draft' | 'bulk_upload' | 'enrollment' | 'attendance' | string;
  message: string;
  time: string;
}

export interface ProviderDashboardResponse {
  overview: DashboardOverview;
  topPrograms: DashboardTopProgram[];
  recentActivities: DashboardActivity[];
}

// ─── Provider Service ────────────────────────────────────────────────────────

export const providerService = {
  /**
   * Upload a CSV file to bulk-create programs.
   */
  bulkUploadPrograms: async (file: File): Promise<BulkUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<BulkUploadResponse>(
      '/training-provider/programs/bulk',
      formData
    );
    return response.data;
  },

  /**
   * Fetch paginated draft programs for the current provider.
   */
  getDraftPrograms: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<DraftProgramsResponse> => {
    const response = await api.get<{ data: DraftProgramsResponse }>(
      '/training-provider/programs/drafts',
      { params }
    );
    return response.data.data;
  },

  /**
   * Fetch a single draft program by its ID.
   */
  getDraftById: async (id: string): Promise<DraftProgram> => {
    const response = await api.get<{ data: DraftProgram }>(
      `/training-provider/programs/${id}`
    );
    return response.data.data;
  },

  /**
   * Update a draft program.
   */
  updateDraft: async (
    id: string,
    data: UpdateDraftPayload,
    brochureFile?: File
  ): Promise<DraftProgram> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (brochureFile) {
      formData.append('brochure', brochureFile);
    }

    const response = await api.put<{ data: DraftProgram }>(
      `/training-provider/programs/${id}`,
      formData
    );
    return response.data.data;
  },

  /**
   * Publish a draft program (change status from draft → published).
   */
  publishDraft: async (id: string): Promise<void> => {
    await api.patch(`/training-provider/programs/${id}/publish`);
  },

  /**
   * Delete a draft program permanently.
   */
  deleteDraft: async (id: string): Promise<void> => {
    await api.delete(`/training-provider/programs/${id}`);
  },

  /**
   * Fetch real training provider dashboard data from backend.
   */
  getDashboardData: async (): Promise<ProviderDashboardResponse> => {
    const response = await api.get<{ data: ProviderDashboardResponse }>(
      '/training-provider/dashboard'
    );
    return response.data.data;
  },
};
