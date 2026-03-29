import type { BackendUser, BackendPaginatedResponse } from "@/lib/api/types";
import type { PaginatedResponse, ApproveUserPayload, User, UserStatus, Role } from "@/types/registration";
import API from "@/lib/api";


function mapBackendUser(u: BackendUser): User {
  const displayName = u.username?.trim() || u.name?.trim() || u.email || "Unknown";
  return {
    id: u.id,
    name: displayName,
    email: u.email,
    createdAt: u.createdAt,
    status: u.approval_status ?? "pending",
    role: u.role,
  };
}

function coerceNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

/** Normalize common API shapes so the UI renders even if the contract drifts slightly. */
function normalizePaginatedBody(raw: unknown): {
  rows: BackendUser[];
  total: number;
  page: number;
  limit: number;
} {
  if (raw === null || typeof raw !== "object") {
    throw new Error(`[getRegistrations] Expected JSON object, received: ${typeof raw}`);
  }

  const o = raw as Record<string, unknown>;
  const meta =
    o.meta && typeof o.meta === "object" ? (o.meta as Record<string, unknown>) : undefined;

  let rows: unknown[] = [];
  if (Array.isArray(o.data)) rows = o.data;
  else if (Array.isArray(o.users)) rows = o.users;

  const total = coerceNumber(o.total ?? meta?.total, rows.length);
  const page = coerceNumber(o.page ?? meta?.page, 1);
  const limit = coerceNumber(o.limit ?? meta?.limit, 10);

  return {
    rows: rows as BackendUser[],
    total,
    page,
    limit,
  };
}

export interface GetRegistrationsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus | "all";
  role?: Role;
}

export async function getRegistrations({
  page = 1,
  limit = 10,
  search,
  status,
  role,
}: GetRegistrationsOptions): Promise<PaginatedResponse> {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (search) params.search = search;
  if (status && status !== "all") params.status = status;
  if (role) params.role = role;

  const response = await API.get<BackendPaginatedResponse | Record<string, unknown>>(
    "admin/registrations",
    { params }
  );

  const { rows, total, page: resPage, limit: resLimit } =
    normalizePaginatedBody(response.data);

  return {
    users: rows.map(mapBackendUser),
    total,
    page: resPage,
    limit: resLimit,
  };
}

export async function approveUser(
  userId: string,
  payload: ApproveUserPayload
): Promise<void> {
  await API.patch(`admin/users/${userId}`, {
    approval_status: "approved",
    role: payload.role,
    description: payload.note,
  });
}
