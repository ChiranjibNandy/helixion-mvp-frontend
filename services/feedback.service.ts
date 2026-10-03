import { API } from "@/constants/api";
import { api } from "@/lib/api";

export const fetchCompletedFeedbackPrograms = async () => {
  const response = await api.get(API.EMPLOYEE.FEEDBACK_PROGRAMS);
  return response.data.data;
};

export const addFeedback = async (payload: {
  programId: string;
  rating: number;
  remark?: string;
}) => {
  const response = await api.post(API.EMPLOYEE.FEEDBACK, payload);
  return response.data.data;
};