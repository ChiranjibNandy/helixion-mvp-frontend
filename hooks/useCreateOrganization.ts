import { useState } from "react";
import { createOrganizationAPI, bulkUploadOrganizationsAPI } from "@/services/adminService";

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

  return {
    createOrganization,
    bulkUploadOrganizations,
    loading,
    error,
  };
}
