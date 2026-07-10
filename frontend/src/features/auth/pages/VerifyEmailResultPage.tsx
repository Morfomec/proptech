import { VerifyEmailResultUI } from "@/features/auth/components/VerifyEmailResultUI";
import AuthLayout from "@/layouts/AuthLayout";

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { verifyEmail } from "@/features/auth/api/authi.api";
import { isAxiosError } from "axios";

export function VerifyEmailResultPage() {

  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("The verification link is invalid or has expired. Please request a new verification link.");

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
        if (isAxiosError(error) && error.response?.data) {
          const data = error.response.data as any;
          let errMsg = "The verification link is invalid or has expired. Please request a new verification link.";
          if (data.detail) errMsg = data.detail;
          else if (data.message) errMsg = data.message;
          else if (typeof data === "object") {
              const firstError = Object.values(data)[0];
              if (Array.isArray(firstError)) errMsg = firstError[0];
              else if (typeof firstError === "string") errMsg = firstError;
          } else if (typeof data === "string") errMsg = data;
          setErrorMessage(errMsg);
        }
        setStatus("error");
      }
    };
    verify();
  }, [uid, token]);

  return (
    <AuthLayout>
      <VerifyEmailResultUI status={status} errorMessage={errorMessage} />
    </AuthLayout>
  );
}
