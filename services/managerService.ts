import { API } from "@/constants/api";
import { api } from "@/lib/api";
import { ManagerDashboardData } from "@/types/manager";

export const fetchManagerDashboardData = async (): Promise<ManagerDashboardData> => {
  const response = await api.get(API.MANAGER.DASHBOARD);
  const data = response.data?.data;
  if (data == null) throw new Error("Invalid response from manager dashboard API");
  if (!Array.isArray(data.pendingTeamEnrollments)) throw new Error("Malformed dashboard response: missing pendingTeamEnrollments");
  if (!Array.isArray(data.pendingTourApprovals)) throw new Error("Malformed dashboard response: missing pendingTourApprovals");
  return data;
};
