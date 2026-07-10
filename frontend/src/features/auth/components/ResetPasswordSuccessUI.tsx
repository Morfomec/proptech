import { Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router";

export function ResetPasswordSuccessUI() {
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

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Password Reset
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>

          <Link to={ROUTES.LOGIN} className="w-full">
            <Button type="button" className="w-full">
              Continue to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
