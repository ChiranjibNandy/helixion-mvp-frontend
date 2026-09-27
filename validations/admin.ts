import { REQUIRED_ERRORS } from '@/constants/errors';
import { ROLES } from '@/constants/role';
import { z } from 'zod';


export const approveUserSchema = z.object({
  userId: z.string().min(1, REQUIRED_ERRORS.USERID),

  role: z.enum(ROLES, {
    message: REQUIRED_ERRORS.ROLE,
  }),
});

export const rejectUserSchema = z.object({
  userId: z.string().min(1, REQUIRED_ERRORS.USERID),
});

export type ApproveUserInput = z.infer<typeof approveUserSchema>;
export type RejectUserInput = z.infer<typeof rejectUserSchema>;