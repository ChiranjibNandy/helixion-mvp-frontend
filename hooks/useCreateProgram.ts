import { useState } from "react";
import { createProgramAPI } from "@/services/programService";
import { CreateProgramPayload } from "@/props/createprogramPayload";


export function useCreateProgram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProgram = async (
    payload: CreateProgramPayload
  ) => {
    try {
      setLoading(true);
      setError(null);


      await createProgramAPI(payload);

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
    createProgram,
    loading,
    error,
  };
}