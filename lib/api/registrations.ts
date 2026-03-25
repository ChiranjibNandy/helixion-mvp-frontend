import { PaginatedResponse, ApproveUserPayload, User } from "@/types/registration";
import API from "@/lib/api";

export async function getRegistrations(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse> {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (search) {
    params.search = search;
  }

  const response = await API.get("/admin/registrations", { params });
  const responseData = response.data;

  const rawUsers = Array.isArray(responseData?.data) ? responseData.data : [];
  
  return {
    users: rawUsers.map((u: any) => ({
      id: u.id || u._id || "",
      name: u.username || u.name || "Unknown",
      email: u.email || "",
      createdAt: u.createdAt || new Date().toISOString(),
      status: u.approval_status || u.status || "pending",
      role: u.role,
    })),
    total: responseData?.total ?? rawUsers.length,
    page: responseData?.page ?? page,
    limit: responseData?.limit ?? limit,
  };
}

export async function approveUser(
  userId: string,
  payload: ApproveUserPayload
): Promise<User> {
  const backendPayload = {
    approval_status: "approved",
    role: payload.role,
    description: payload.note,
  };
  const response = await API.patch(`/admin/users/${userId}`, backendPayload);
  return response.data;
}
