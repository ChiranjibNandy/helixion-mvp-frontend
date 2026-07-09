import { API } from "@/constants/api";
import { api } from "@/lib/api";

export interface EmployeeNotification {
  id:           string;
  type:         string;
  message:      string;
  enrollmentId: string;
  at:           string;
}

export const getEmployeeNotifications = async (): Promise<EmployeeNotification[]> => {
  const response = await api.get(API.EMPLOYEE.NOTIFICATIONS);
  return response.data.data;
};
