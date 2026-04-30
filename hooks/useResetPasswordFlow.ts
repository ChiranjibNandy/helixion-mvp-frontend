'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { useResetPassword } from "@/hooks/useResetPassword";
import { ROUTES } from "@/constants/navigation";

type Step = "email" | "reset" | "success";

export function useResetPasswordFlow(userId?: string) {
   const router = useRouter();

   const forgot = useForgotPassword();
   const reset = useResetPassword();

   const [step, setStep] = useState<Step>("email");

   const [email, setEmail] = useState("");

   const [form, setForm] = useState({
      password: "",
      confirmPassword: "",
   });

   const [success, setSuccess] = useState(false);

   const loading = forgot.loading || reset.loading;
   const error = forgot.error || reset.error;

   const setField = (field: string, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
   };

   const sendResetLink = async (emailOverride?: string) => {
      const emailToUse = emailOverride || email;

      const ok = await forgot.sendResetLink(emailToUse);

      return ok;
   };

   // 🔹 Step 2: Reset password
   const submitNewPassword = async () => {
      if (!userId) return;

      if (form.password !== form.confirmPassword) {
         return;
      }

      const ok = await reset.resetPassword({
         userId,
         newPassword: form.password,
         confirmPassword: form.confirmPassword,
      });

      if (ok) {
         setSuccess(true);
         setStep("success");

         setTimeout(() => {
            router.push(ROUTES.SIGNIN);
         }, 2000);
      }
   };

   return {
      // state
      step,
      email,
      form,
      success,
      loading,
      error,

      // actions
      setEmail,
      setField,
      sendResetLink,
      submitNewPassword,
   };
}