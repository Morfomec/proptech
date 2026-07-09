import { z } from "zod";

export const registerSchema = z
  .object({
    first_name: z.string().optional(),

    last_name: z.string().optional(),

    email: z.email("Enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    confirm_password: z.string(),
  })

  .refine(
    (data) => data.password === data.confirm_password,
    {
      path: ["confirm_password"],
      message: "Passwords do not match.",
    }
  );

export type RegisterFormData =
  z.infer<typeof registerSchema>;