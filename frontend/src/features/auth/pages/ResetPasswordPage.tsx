import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import AuthLayout from "@/layouts/AuthLayout";

export function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
