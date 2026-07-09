import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Eye, EyeOff, User, Mail, Lock } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import {
  registerSchema,
  type RegisterFormData,
} from "@/features/auth/schemas/register.schema";

import { register as registerUser } from "@/api/auth.api";

import { APP } from "@/constants/app";
import { ROUTES } from "@/constants/routes";

export function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError("");
    setIsLoading(true);

    try {
      await registerUser(data);

      navigate(ROUTES.VERIFY_EMAIL);
    } catch {
      setRegisterError("Registration failed. Please try again.");
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
            Create your account
          </h2>

          <p className="text-sm text-slate-500">
            Join {APP.NAME} to rent, buy, sell or manage properties.
          </p>
        </div>


      {registerError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {registerError}
        </div>
      )}

      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <div>
          <Input
            label="First Name"
            placeholder="John"
            icon={<User className="h-4 w-4" />}
            {...register("first_name")}
            disabled={isLoading}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Last Name"
            placeholder="Doe"
            icon={<User className="h-4 w-4" />}
            {...register("last_name")}
            disabled={isLoading}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.last_name.message}
            </p>
          )}
        </div>

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
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            rightIcon={
              showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )
            }
            onRightIconClick={() =>
              setShowPassword((prev) => !prev)
            }
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            rightIcon={
              showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )
            }
            onRightIconClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            {...register("confirm_password")}
            disabled={isLoading}
          />
          {errors.confirm_password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300"
            disabled={isLoading}
          />

          <span className="text-slate-600">
            I agree to the{" "}
            <Link
              to="/terms"
              className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button
          type="submit"
          className="mt-2"
          isLoading={isLoading}
        >
          Create Account
        </Button>

      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
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