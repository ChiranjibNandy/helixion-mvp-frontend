import { useState } from "react";
import { updateEmployeeAPI, UpdateEmployeePayload } from "@/services/adminService";

export function useUpdateEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEmployee = async (id: string, payload: UpdateEmployeePayload) => {
    try {
      setLoading(true);
      setError(null);

      await updateEmployeeAPI(id, payload);

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
    updateEmployee,
    loading,
    error,
  };
}
