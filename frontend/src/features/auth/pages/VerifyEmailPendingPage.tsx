import { VerifyEmailPendingUI } from "@/features/auth/components/VerifyEmailPendingUI";
import AuthLayout from "@/layouts/AuthLayout";

export function VerifyEmailPendingPage() {
  return (
    <AuthLayout>
      <VerifyEmailPendingUI />
    </AuthLayout>
  );
}
