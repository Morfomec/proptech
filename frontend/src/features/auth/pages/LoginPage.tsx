
// import { AuthHero } from "@/features/auth/components/AuthHero";
import { LoginForm } from "@/features/auth/components/LoginForm";
import AuthLayout from "@/layouts/AuthLayout";

export function LoginPage() {
  return (
    <AuthLayout>
        <LoginForm />
    </AuthLayout>
  );
}
