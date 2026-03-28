import type { Role } from "@/types/registration";

export interface RoleOption {
  role: Role;
  label: string;
  description: string;
}

/**
 * Platform role configuration — single source of truth.
 *
 * `as const` ensures the array and its items are deeply readonly.
 * This prevents accidental mutation (e.g. ROLE_OPTIONS.push(...)) and
 * makes the type as narrow as possible for downstream consumers.
 *
 * Future path: replace with a TanStack Query call to GET /admin/roles.
 * The RoleOption shape above is designed to match that future response.
 */
export const ROLE_OPTIONS = [
  {
    role: "employee" as Role,
    label: "Employee",
    description: "Access training & enrollment",
  },
  {
    role: "training_provider" as Role,
    label: "Training Provider",
    description: "Upload & manage programs",
  },
  {
    role: "manager" as Role,
    label: "Manager",
    description: "View team progress",
  },
  {
    role: "admin" as Role,
    label: "Admin",
    description: "Full platform access",
  },
] satisfies RoleOption[];

/**
 * Set of all valid role values.
 * Used for O(1) runtime validation at the API mapping layer.
 * Updating ROLE_OPTIONS automatically updates this set.
 */
export const VALID_ROLES: ReadonlySet<Role> = new Set(
  ROLE_OPTIONS.map((r) => r.role)
);
