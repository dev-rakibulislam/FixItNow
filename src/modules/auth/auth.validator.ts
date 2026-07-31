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

export const userRegisterSchema = userLoginSchema
  .extend({
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
    role: z.enum(UserRole),

    bio: z
      .string()
      .trim()
      .min(10, "Bio must be at least 10 characters long")
      .max(500, "Bio must be less than 500 characters long")
      .optional(),

    hourlyRate: z
      .string()
      .trim()
      .min(1, "Hourly rate must be at least 1 character long")
      .max(20, "Hourly rate must be less than 20 characters long")
      .optional(),

    yearsOfExperience: z
      .number()
      .min(0, "Years of experience must be at least 0")
      .max(100, "Years of experience must be less than 100")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === UserRole.TECHNICIAN) {
      if (!data.bio) {
        ctx.addIssue({
          code: "custom",
          path: ["bio"],
          message: "Bio is required for technicians",
        });
      }

      if (data.hourlyRate === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["hourlyRate"],
          message: "Hourly rate is required",
        });
      }

      if (data.yearsOfExperience === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["yearsOfExperience"],
          message: "Years of experience is required",
        });
      }
    }
  });

export type UserLoginPayload = z.infer<typeof userLoginSchema>;
export type UserRegisterPayload = z.infer<typeof userRegisterSchema>;
