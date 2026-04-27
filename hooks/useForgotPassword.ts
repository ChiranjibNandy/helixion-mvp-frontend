import { useState } from "react";
import { forgotPasswordAPI } from "@/utils/authService";

export function useForgotPassword() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const sendResetLink = async (email: string) => {
      try {
         setLoading(true);
         setError(null);

         await forgotPasswordAPI({ email });

         return true;
      } catch (err: any) {
         setError(
            err?.response?.data?.message || "Something went wrong. Please try again."
         );
         return false;
      } finally {
         setLoading(false);
      }
   };

   return {
      sendResetLink,
      loading,
      error,
   };
}