import { VerifyEmailResultUI } from "@/features/auth/components/VerifyEmailResultUI";
import AuthLayout from "@/layouts/AuthLayout";

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { verifyEmail } from "@/features/auth/api/authi.api";

export function VerifyEmailResultPage() {

  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verify = async () => {
      if (!uid || !token) {
        setStatus("error");
        return ;
      }

      try {
        await verifyEmail({ uid, token });
        setStatus("success");

      } catch (error) {
        setStatus("error");
      }
    };
    verify();
  }, [uid, token]);

  return (
    <AuthLayout>
      <VerifyEmailResultUI status={status} />
    </AuthLayout>
  );
}
