import { API } from "@/constants/api";
import { api } from "@/lib/api";
import { approveUserSchema } from "@/validations/admin";

//using reset password- all user list
export const getUsersAPI = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return await api.get(API.ADMIN.USERS, {
    params,
  });
};

//using to approve and assign role of pending user list in admin
export const getPendingUserAPI = async () => {
  return await api.get(API.ADMIN.REGISTRATIONS)
}

//approve the user and assign role
export const approveUserAPI = async (data: { userId: string, role: string }) => {
  const parsed = approveUserSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  const { userId, role } = parsed.data;

  return await api.patch(`${ API.ADMIN.USERS }/${ userId }`, {
    role,
  });
};

// whether an org (with a saved policy) exists yet — drives sidebar gating
// for org-dependent screens like Bulk Import (ticket 0041). Also carries the
// admin's own orgId when one exists, so the Org Policy Setup page can fetch
// full details and switch itself into edit mode.
export const getOrganizationStatusAPI = async () => {
  return await api.get(API.ADMIN.ORGANIZATIONS_STATUS);
};

// org-scoped dashboard summary counts (total users, pending approval, deactivated)
export const getAdminDashboardStatsAPI = async () => {
  return await api.get(API.ADMIN.DASHBOARD_STATS);
};

// create a new organization with its full policy schedule in one step
export const createOrganizationAPI = async (payload: unknown) => {
  return await api.post(API.ADMIN.ORGANIZATIONS, payload);
};

// platform-wide, paginated list of every organization ever created
export const getOrganizationsAPI = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return await api.get(API.ADMIN.ORGANIZATIONS, { params });
};

// bulk-create organizations from a CSV (same field name as the training
// provider's program bulk-upload — the multer middleware expects "file")
export const bulkUploadOrganizationsAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return await api.post(API.ADMIN.ORGANIZATIONS_BULK, formData);
};

export interface OrganizationDetail {
  id: string;
  name: string;
  slug: string;
  orgType: string;
  status: string;
  policy: Record<string, any>;
  policyAssignments: { trainingDeptChain: unknown[]; osdChain: unknown[] };
  createdAt: string;
}

// Full org record (incl. policy) for the edit form — narrower than the list
// endpoint, which only projects name/slug/orgType/status/createdAt.
export const getOrganizationByIdAPI = async (id: string) => {
  return await api.get(API.ADMIN.GET_ORGANIZATION(id));
};

// Identity/status fields only (name/slug/orgType/status) — policy edits go
// through updateOrganizationPolicyAPI on its own route.
export const updateOrganizationAPI = async (
  id: string,
  payload: { name?: string; slug?: string; orgType?: string; status?: string }
) => {
  return await api.patch(API.ADMIN.UPDATE_ORGANIZATION(id), payload);
};

export const updateOrganizationPolicyAPI = async (id: string, payload: unknown) => {
  return await api.patch(API.ADMIN.UPDATE_ORGANIZATION_POLICY(id), payload);
};

// Create a single employee directly — the only way to create someone with
// no reporting manager, since bulk upload requires one on every row.
// reportingManagerEmail is intentionally optional here.
export interface CreateSingleUserPayload {
  name: string;
  email: string;
  employeeCode?: string;
  mobile?: string;
  placeOfPosting?: string;
  designation?: string;
  department?: string;
  reportingManagerEmail?: string;
  // Single CTD/OSD flag per org — no Junior/Senior tiers.
  trainingDeptSeniorOfficer?: boolean;
  osdSeniorOfficer?: boolean;
  // Toggles orgRole between EMPLOYEE and MANAGER only — status/password stay
  // owned by the activate/deactivate flows, and this can never produce an
  // admin/training_provider account.
  isManager?: boolean;
}

export const createSingleUserAPI = async (payload: CreateSingleUserPayload) => {
  return await api.post(API.ADMIN.USERS, payload);
};

// Employee-details edit — same field set as CreateSingleUserPayload, all
// optional since a PATCH may touch just one field. status/password
// are intentionally absent: those stay owned by the approve/activate/
// deactivate flows. skip1Email/skip2Email are edit-only — Add Employee's
// single-create endpoint has no skip-level concept, only bulk upload and
// this edit endpoint do.
export type UpdateEmployeePayload = Partial<CreateSingleUserPayload> & {
  skip1Email?: string;
  skip2Email?: string;
};

export interface EmployeeDetail extends CreateSingleUserPayload {
  id: string;
  orgRole: string;
  status: string;
  skip1Email?: string | null;
  skip2Email?: string | null;
}

export const getEmployeeAPI = async (id: string) => {
  return await api.get(API.ADMIN.GET_EMPLOYEE(id));
};

export const updateEmployeeAPI = async (id: string, payload: UpdateEmployeePayload) => {
  return await api.patch(API.ADMIN.UPDATE_EMPLOYEE(id), payload);
};