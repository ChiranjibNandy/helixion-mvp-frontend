import { PaginatedResponse, ApproveUserPayload, User } from "@/types/registration";

export async function getRegistrations(
  page: number = 1,
  limit: number = 5,
  search?: string
): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  const response = await fetch(`/api/admin/registrations?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch registrations");
  }

  return response.json();
}

export async function approveUser(
  userId: string,
  payload: ApproveUserPayload
): Promise<User> {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to approve user");
  }

  return response.json();
}
