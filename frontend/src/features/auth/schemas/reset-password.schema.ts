import { z } from "zod";

export const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords dont match",
    path: ["confirm_password"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;


