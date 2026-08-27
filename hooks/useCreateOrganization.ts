import { useState } from "react";
import { createOrganizationAPI, bulkUploadOrganizationsAPI, updateOrganizationAPI, updateOrganizationPolicyAPI } from "@/services/adminService";

export function useCreateOrganization() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrganization = async (payload: unknown) => {
    try {
      setLoading(true);
      setError(null);

      await createOrganizationAPI(payload);

      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  const bulkUploadOrganizations = async (file: File) => {
    try {
      setLoading(true);
      setError(null);

      await bulkUploadOrganizationsAPI(file);

      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Edit path: identity fields and policy live on separate backend routes,
  // so a full "save" is these two calls run together by the caller — kept
  // as two functions (rather than one combined call) so a failure in one
  // doesn't hide whether the other half actually saved.
  const updateOrganization = async (id: string, payload: { name?: string; slug?: string; orgType?: string; status?: string }) => {
    try {
      setLoading(true);
      setError(null);

      await updateOrganizationAPI(id, payload);

      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOrganizationPolicy = async (id: string, payload: unknown) => {
    try {
      setLoading(true);
      setError(null);

      await updateOrganizationPolicyAPI(id, payload);

      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrganization,
    bulkUploadOrganizations,
    updateOrganization,
    updateOrganizationPolicy,
    loading,
    error,
  };
}
