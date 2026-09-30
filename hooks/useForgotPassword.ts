import { useState } from "react";
import { forgotPasswordAPI } from "@/services/authService";
import { ResetLinkResult } from "@/types";

export function useForgotPassword() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const sendResetLink = async (email: string | string[]): Promise<ResetLinkResult | null> => {
      try {
         setLoading(true);
         setError(null);

         const emailList = Array.isArray(email)
            ? email
            : [email];

         const response = await forgotPasswordAPI({
            email: emailList,
         });

         return response.data.data;
      } catch (err: any) {
         setError(
            err?.response?.data?.message || "Something went wrong. Please try again."
         );
         return null;
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