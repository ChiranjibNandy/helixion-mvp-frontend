import { API } from "@/constants/api";
import { api } from "@/lib/api";
import { TrainingDeptDashboardData } from "@/types/trainingDept";

export const fetchTrainingDeptDashboardData = async (): Promise<TrainingDeptDashboardData> => {
  const response = await api.get(API.TRAININGDEPT.DASHBOARD);
  const data = response.data?.data;
  if (data == null) throw new Error("Invalid response from training dept dashboard API");
  if (!Array.isArray(data.pendingReviews)) throw new Error("Malformed dashboard response: missing pendingReviews");
  return data;
};
