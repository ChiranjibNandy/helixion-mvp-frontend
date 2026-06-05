import { API } from "@/constants/api";
import { api } from "@/lib/api";
import type { AvailableProgram, StayTypeKey } from "@/types";

export const fetchEmployeeDashboardData = async () => {
  const response = await api.get(API.EMPLOYEE.DASHBOARD);
  return response.data.data;
};

export const getAvailablePrograms = async (params?: {
  page?:     number;
  limit?:    number;
  search?:   string;
  venue?:    string;
  fromDate?: string;
  toDate?:   string;
}): Promise<{ programs: AvailableProgram[]; total: number; page: number; totalPages: number }> => {
  const response = await api.get(API.EMPLOYEE.PROGRAMS, { params });
  return response.data.data;
};

export const enrollInProgram = async (
  programId: string,
  stayType: StayTypeKey,
  notes?: string
): Promise<{
  enrollmentId:    string;
  status:          string;
  approvalStatus:  string;
  feeAmount:       number;
  currency:        string;
  programSnapshot: { title: string; startDate?: string; endDate?: string; venue?: string };
}> => {
  const response = await api.post(API.EMPLOYEE.ENROLL(programId), { stayType, notes });
  return response.data.data;
};
