import { useState } from "react";
import { createSingleUserAPI, CreateSingleUserPayload } from "@/services/adminService";

export function useCreateSingleUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSingleUser = async (payload: CreateSingleUserPayload) => {
    try {
      setLoading(true);
      setError(null);

      await createSingleUserAPI(payload);

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
    createSingleUser,
    loading,
    error,
  };
}
