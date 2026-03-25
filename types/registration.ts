export type Role = "employee" | "training_provider" | "manager" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: "pending" | "active" | "denied";
  role?: Role;
}

export interface PaginatedResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface ApproveUserPayload {
  role: Role;
  note?: string;
}
