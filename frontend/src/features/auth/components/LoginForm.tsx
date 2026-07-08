// src/components/LoginForm.tsx
import { Mail, Lock, Eye, Building2 } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";


export function LoginForm() {
  return (
    <div className="flex w-full flex-col justify-center px-4 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32">
      <div className="mx-auto flex w-full max-w-sm flex-col">
        
        <div className="mb-8 flex items-center justify-center gap-2 text-slate-900 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">PropTech</span>
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 hidden items-center gap-2 text-slate-900 lg:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">proptech</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500">Please enter your details to sign in.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <Input 
            label="Email address or Phone Number"
            type="email"
            placeholder="name@company.com"
            icon={<Mail className="h-4 w-4" />}
          />
          
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            rightIcon={<Eye className="h-4 w-4" />}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <button type="button" className="font-medium text-emerald-600 hover:text-emerald-500" onClick={() => {}}>
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="mt-2" onClick={() => {}}>
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

        <Button variant="outline" type="button" onClick={() => {}} icon={
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
          <button type="button" className="font-medium text-emerald-600 hover:text-emerald-500" onClick={() => {}}>
            Sign up
          </button>
        </p>

      </div>
    </div>
  );
}
