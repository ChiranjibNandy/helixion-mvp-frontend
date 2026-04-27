import { api } from "@/lib/api";
import { RegisterCredentials } from "@/types/auth";
import { forgotPasswordSchema, resetPasswordSchema, signinSchema, signupSchema } from "@/validations/auth";


//login the user

export const loginAPI = async (data: { email: string; password: string }) => {
  const parsed = signinSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    });

    throw fieldErrors;
  }

  return await api.post("/auth/login", data);
};

//Registration of user

export const registerAPI = async (data: RegisterCredentials) => {
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    });

    throw fieldErrors;
  }

  return await api.post('/auth/register', data);
};

// ── Forgot Password ────────────────────────────────────────────────────────

export const forgotPasswordAPI = async (data: { email: string }) => {
  const parsed = forgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    });
    throw fieldErrors;
  }
  return await api.post("/auth/send-reset-link", data);
};


// ── Reset Password ────────────────────────────────────────────────────────

export const resetPasswordAPI = async (data: {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const parsed = resetPasswordSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    });
    throw fieldErrors;
  }

  return await api.patch("/auth/reset-password", data);
};


