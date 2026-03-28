import type { BackendUser, BackendPaginatedResponse } from "@/lib/api/types";
import type { PaginatedResponse, ApproveUserPayload, User } from "@/types/registration";
import API from "@/lib/api";


function mapBackendUser(u: BackendUser): User {
  return {
    id: u.id,
    name: u.username,
    email: u.email,
    createdAt: u.createdAt,
    status: u.approval_status,
    role: u.role,
  };
}

export async function getRegistrations(
  page: number,
  limit: number,
  search?: string
): Promise<PaginatedResponse> {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (search) params.search = search;

  const response = await API.get<BackendPaginatedResponse>(
    "/admin/registrations",
    { params }
  );

  const raw = response.data;

  // Runtime shape guard. If the API diverges from the contract we get a
  // descriptive error in the console/Sentry — not a silent empty list.
  if (!Array.isArray(raw?.data)) {
    throw new Error(
      `[getRegistrations] Expected response.data.data to be an array, received: ${typeof raw?.data}`
    );
  }

  // Guard missing pagination metadata — avoids NaN in Math.ceil() call sites.
  if (
    typeof raw.total !== "number" ||
    typeof raw.page !== "number" ||
    typeof raw.limit !== "number"
  ) {
    throw new Error(
      `[getRegistrations] Missing pagination metadata in response: ${JSON.stringify({ total: raw.total, page: raw.page, limit: raw.limit })}`
    );
  }

  return {
    users: raw.data.map(mapBackendUser),
    total: raw.total,
    page: raw.page,
    limit: raw.limit,
  };
}

export async function approveUser(
  userId: string,
  payload: ApproveUserPayload
): Promise<void> {
  await API.patch(`/admin/users/${userId}`, {
    approval_status: "approved",
    role: payload.role,
    description: payload.note,
  });
}
