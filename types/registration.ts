// ─────────────────────────────────────────────────────────────────────────────
// UI-layer domain types for the registration feature.
//
// These types are NEVER shaped like the API. They represent what the
// application works with after the API mapping layer has normalised the data.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All valid statuses for a user registration.
 * "pending" is the default for newly-registered users awaiting admin review.
 */
export type UserStatus = "pending" | "active" | "denied";

/**
 * All valid roles in the platform.
 * Display labels and descriptions live in `config/roles.ts` — not here.
 * This file is for types only; zero runtime values.
 */
export type Role = "employee" | "training_provider" | "manager" | "admin";

/**
 * Normalised user shape used throughout the UI.
 *
 * Key mapping from API:
 *   BackendUser.username       → User.name
 *   BackendUser.approval_status → User.status
 */
export interface User {
  id: string;
  name: string;
  email: string;
  /** ISO 8601 date string. Use formatRegistrationDate() for display. */
  createdAt: string;
  status: UserStatus;
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
  /** Optional internal/admin-facing note attached to the approval action. */
  note?: string;
}
