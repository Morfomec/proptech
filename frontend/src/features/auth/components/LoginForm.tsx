// src/components/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginFormData,
} from "@/features/auth/schemas/login.schema";


import { Mail, Lock, Eye, Building2, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { login } from "@/features/auth/api/authi.api";
import { saveTokens } from "@/utils/token";
import { Link, useNavigate } from "react-router";
import { useState } from "react";


import { APP } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { FormAlert } from "@/components/ui/FormAlert";
import { getApiErrorMessage } from "@/api/error";

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const [loginError, setloginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: LoginFormData) => {
        setloginError("");
        setIsLoading(true);

        try {
            const response = await login(data);

            saveTokens(
                response.tokens.access,
                response.tokens.refresh
            );

            navigate(ROUTES.DASHBOARD);

            console.log("Logged in!");
        } catch (error) {
            setloginError(getApiErrorMessage(error));
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
          <span className="text-xl font-bold tracking-tight">PropTech</span>
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 hidden items-center gap-2 text-slate-900 lg:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary shadow-sm shadow-brand-primary/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">{APP.NAME}</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500">Please enter your details to sign in.</p>
        </div>

        {loginError && (
          <FormAlert message={loginError} />
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            icon={<Mail className="h-4 w-4" />}
            {...register("email")}
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
            </p>
            )}
          
          <Input 
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            rightIcon={
                showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ):(
                    <Eye className="h-4 w-4" />
                )
            }
            onRightIconClick={() =>
                setShowPassword((prev) => !prev)
            }
            {...register("password")}
            autoComplete="current-password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
            </p>
            )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary transition-colors" disabled={isLoading} />
              <span className="text-slate-600">Remember me</span>
            </label>
            <Link to={ROUTES.FORGOT_PASSWORD} className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors" >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="mt-2" isLoading={isLoading}>
            Sign in
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 font-medium tracking-wider text-slate-400">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" type="button" icon={
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        }>
          Google
        </Button>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER}>
          <button type="button" className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors" >
            Sign up
          </button>
          </Link>
        </p>

      </div>
    </div>
  );
}
