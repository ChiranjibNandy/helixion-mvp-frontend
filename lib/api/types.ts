// ─────────────────────────────────────────────────────────────────────────────
// Raw API contract types — shapes that come directly from the backend.
//
// RULE: Nothing outside `lib/api/` should import from this file.
// UI components and hooks always work with the mapped types in `types/`.
// ─────────────────────────────────────────────────────────────────────────────

import type { Role, UserStatus } from "@/types/registration";

/**
 * Raw shape of a single user record from GET /admin/registrations.
 * Field names match the backend JSON exactly — do not rename.
 */
export interface BackendUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  approval_status: UserStatus;
  role?: Role;
}

/**
 * Paginated envelope from GET /admin/registrations.
 */
export interface BackendPaginatedResponse {
  data: BackendUser[];
  total: number;
  page: number;
  limit: number;
}
