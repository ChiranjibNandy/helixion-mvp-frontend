// Role definitions for the application

// Available user roles in the system
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MANAGER: "manager",
  TRAINER: "trainer",
} as const;

// Type representing valid user roles
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Role display labels for UI
export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: "Administrator",
  [USER_ROLES.USER]: "Standard User",
  [USER_ROLES.MANAGER]: "Manager",
  [USER_ROLES.TRAINER]: "Trainer",
} as const;

// Role descriptions for UI tooltips/help text
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: "Full system access and user management",
  [USER_ROLES.USER]: "Standard access to assigned resources",
  [USER_ROLES.MANAGER]: "Team oversight and reporting access",
  [USER_ROLES.TRAINER]: "Training content management and delivery",
} as const;

// Default role for new approved users
export const DEFAULT_APPROVAL_ROLE: UserRole = USER_ROLES.USER;

// Roles available for assignment during user approval

export const ASSIGNABLE_ROLES: UserRole[] = [
  USER_ROLES.USER,
  USER_ROLES.MANAGER,
  USER_ROLES.TRAINER,
  USER_ROLES.ADMIN,
] as const;

// Get display label for a role
export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] || role;
}

// Get description for a role
export function getRoleDescription(role: UserRole): string {
  return ROLE_DESCRIPTIONS[role] || "";
}

// Check if a role is valid
export function isValidRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole);
}
