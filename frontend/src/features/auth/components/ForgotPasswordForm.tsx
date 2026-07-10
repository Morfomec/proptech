import { Building2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { APP } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  forgotPasswordSchema, 
  type ForgotPasswordFormData } 
  from "@/features/auth/schemas/forgot-password.schema";
import { useState } from "react";
import { requestPasswordReset } from "@/features/auth/api/authi.api";


export function ForgotPasswordForm() {
  
  const { register, handleSubmit, formState: { errors }} = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSubmitError("");
    setIsLoading(true);

    try {
      await requestPasswordReset(data.email);

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Forgot Password Error:", error.response || error);
      setSubmitError(`Failed to send reset link. Error: ${error.response?.status || 'Network Error'}`);
    } finally {
      setIsLoading(false);
    }
  };

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
            Forgot password?
          </h2>
          <p className="text-sm text-slate-500">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {isSuccess && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Password reset link sent! Please check your email.
          </div>
        )}
        {submitError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}


        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              {...register("email")}
              disabled={isLoading}
            />
            {/* Show Zod Validation Errors */}
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            className="mt-2"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
