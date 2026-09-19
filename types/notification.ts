export interface NotificationItem {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  icon: string;
  color: string;
  read: boolean;
  relatedEntityId?: string | null;
  createdAt: string;
}

export interface NotificationsApiResponse {
  success: boolean;
  data: {
    notifications: NotificationItem[];
    unreadCount: number;
  };
}