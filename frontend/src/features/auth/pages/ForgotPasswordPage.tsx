import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import AuthLayout from "@/layouts/AuthLayout";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
