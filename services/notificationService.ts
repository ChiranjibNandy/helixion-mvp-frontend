import { API } from "@/constants/api";
import { api } from "@/lib/api";

export interface EmployeeNotification {
  _id: string;
  type: string;
  message: string;
  enrollmentId: string;
  at: string;
  read: boolean
}
export interface getNotificationResponse {
  notifications: EmployeeNotification[]
  unreadCount: number
}

export const getNotifications = async (): Promise<getNotificationResponse> => {
  const response = await api.get(API.NOTIFICATION.LIST);
  return response.data.data;
};


export const readNotification = async (id: string) => {
  const response = await api.patch(API.NOTIFICATION.READ(id));
  return response.data.data;
};
