import type { Role, UserStatus } from "@/types/registration";


export interface BackendUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  approval_status: UserStatus;
  role?: Role;
}


export interface BackendPaginatedResponse {
  data: BackendUser[];
  total: number;
  page: number;
  limit: number;
}
