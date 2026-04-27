import { z } from 'zod';

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, { message: 'Username is required' }),

    email: z
      .string()
      .trim()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email format' }),

    password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/,
        {
          message:
            'Password must contain letter, number, and special character',
        }
      ),

    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });



export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required" }),
});

// validate only the email is required and in correct format or not
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
});

//validate UserId password
export const resetPasswordSchema = z.object({
  userId: z.string(),
  newPassword: z
    .string()
    .trim()
    .min(8, { message: "password has min 8 length" })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "Password must contain at least one letter, one number, and one special character" }
    ),

  confirmPassword: z
    .string()
    .trim()
    .min(1, { message: "password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "password is not match",
  path: ["confirmPassword"],
});
