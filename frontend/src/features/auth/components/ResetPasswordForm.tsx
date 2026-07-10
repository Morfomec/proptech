import { Building2, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { APP } from "@/constants/app";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";

import  { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordSchema, type ResetPasswordFormData} from "@/features/auth/schemas/reset-password.schema";
import { confirmPasswordReset } from "@/features/auth/api/authi.api";
import { ROUTES } from "@/constants/routes";

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { uid, token } = useParams();
  const navigate = useNavigate();

  const  {
    register, handleSubmit, formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await confirmPasswordReset({ 
        uid: uid!, 
        token: token!, 
        password: data.password, 
        confirm_password: data.confirm_password 
      });
      navigate(ROUTES.RESET_PASSWORD_SUCCESS);
    } catch(error: any) {
      console.error(error.response || error);
      setSubmitError("Failed to reset password. The link might be expired or invalid.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col justify-center px-4 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32">
      <div className="mx-auto flex w-full max-w-sm flex-col">
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
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Reset Password
          </h2>
          <p className="text-sm text-slate-500">
            Please choose a new password for your account.
          </p>
        </div>
        

        {submitError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}


        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              autoComplete="new-password"
              rightIcon={
                showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
              }
              onRightIconClick={() => setShowPassword((prev) => !prev)}
              {...register("password")} // Wire up input
              disabled={isLoading}
            />
            {/* Show Zod Validation Errors */}
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              autoComplete="new-password"
              rightIcon={
                showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
              }
              onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
              {...register("confirm_password")} // Wire up input
              disabled={isLoading}
            />
            {/* Show Zod Validation Errors */}
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-2" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>

      </div>
    </div>
  );
}
