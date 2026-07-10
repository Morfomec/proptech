import { ResetPasswordSuccessUI } from "@/features/auth/components/ResetPasswordSuccessUI";
import AuthLayout from "@/layouts/AuthLayout";

export function ResetPasswordSuccessPage() {
  return (
    <AuthLayout>
      <ResetPasswordSuccessUI />
    </AuthLayout>
  );
}
