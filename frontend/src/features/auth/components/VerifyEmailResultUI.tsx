import { Building2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router";

interface VerifyEmailResultUIProps {
  status: "loading" | "success" | "error";
  onRetry?: () => void;
}

export function VerifyEmailResultUI({ status, onRetry }: VerifyEmailResultUIProps) {
  return (
    <div className="flex w-full flex-col justify-center px-4 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
        <div className="mb-8 flex items-center justify-center gap-2 text-slate-900 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary shadow-sm shadow-brand-primary/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            {APP.NAME}
          </span>
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 hidden items-center gap-2 text-slate-900 lg:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary shadow-sm shadow-brand-primary/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">{APP.NAME}</span>
          </div>

          {status === "loading" && (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Verifying your email
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Email Verified!
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Your email address has been successfully verified. You can now sign in to your account.
              </p>
              <Link to={ROUTES.LOGIN} className="w-full">
                <Button type="button" className="w-full">
                  Continue to Sign In
                </Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Verification Failed
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                The verification link is invalid or has expired. Please request a new verification link.
              </p>
              <Button type="button" className="w-full" onClick={onRetry}>
                Request New Link
              </Button>
            </>
          )}
        </div>
        
        {status !== "success" && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Back to{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
