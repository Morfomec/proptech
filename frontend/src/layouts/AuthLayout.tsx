import  { ReactNode } from "react";
import  { AuthHero } from "@/features/auth/components/AuthHero";
 
interface AuthLayoutProps {
    children: ReactNode;
}



export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div className="flex flex-1">
        <AuthHero />
        {children}
      </div>

      <footer className="absolute bottom-6 w-full text-center lg:right-0 lg:w-1/2">
        <p className="mb-1 text-xs text-slate-400">
          © 2026 PropTech Solutions Inc. All rights reserved.
        </p>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <button
            type="button"
            className="transition-colors hover:text-slate-600"
          >
            Privacy Policy
          </button>

          <button
            type="button"
            className="transition-colors hover:text-slate-600"
          >
            Terms of Service
          </button>
        </div>
      </footer>
    </div>
  );
}