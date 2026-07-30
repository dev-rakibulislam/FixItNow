import z, { email } from "zod";
import { UserRole } from "../../../generated/prisma/enums";

export const userLoginSchema = z.object({
  email: z.email({
    error: (i) =>
      i.input == null ? "Email is required" : "Please provide a valid email",
  }),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters long"),
});
9;

export const userRegisterSchema = userLoginSchema.extend({
  firstName: z
    .string({
      error: (i) =>
        i.input == null ? "First name is required" : "Name must be a string",
    })
    .trim()
    .min(3, "First name must be at least 3 characters long")
    .max(100, "First name must be less than 100 characters long"),
  lastName: z
    .string()
    .trim()
    .min(3, "Last name must be at least 3 characters long")
    .max(100, "Last name must be less than 100 characters long")
    .optional(),
  phoneNumber: z
    .string()
    .trim()
    .min(11, "Phone number must be at least 11 characters long")
    .max(14, "Phone number must be less than 14 characters long")
    .optional(),
  role: z.enum(UserRole).optional()
});

export type UserLoginPayload = z.infer<typeof userLoginSchema>;
export type UserRegisterPayload = z.infer<typeof userRegisterSchema>;
