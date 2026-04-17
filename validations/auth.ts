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