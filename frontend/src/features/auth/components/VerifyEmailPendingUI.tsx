import { Building2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router";

import { resendVerification } from "../api/authi.api";
import { useState } from "react";

export function VerifyEmailPendingUI() {
  const [isResending, setIsResending] = useState(false);

  // 1. Retrieve the email you saved in RegisterForm
  const userEmail = sessionStorage.getItem("pendingEMail") || "";

  const handleResend = async () => {
    // If somehow the email is missing, don't try to send it
    if (!userEmail) return; 

    setIsResending(true);
    try {
      await resendVerification(userEmail);
      alert("Verification email sent!"); // Optional: show a quick success message
    } catch (error) {
      alert("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex w-full flex-col justify-center px-4 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
        
        {/* Mobile Logo */}
        <div className="mb-8 flex items-center justify-center gap-2 text-slate-900 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary shadow-sm shadow-brand-primary/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            {APP.NAME}
          </span>
        </div>

        {/* Desktop Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 hidden items-center gap-2 text-slate-900 lg:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary shadow-sm shadow-brand-primary/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">{APP.NAME}</span>
          </div>
          
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
            <MailCheck className="h-8 w-8 text-brand-primary" />
          </div>
          
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Check your email
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          
          {/* 2. Moved onClick and isLoading to the Button! */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={handleResend} 
            isLoading={isResending}
          >
            Resend verification email
          </Button>
          
          {/* Removed onClick and isLoading from the p tag */}
          <p className="mt-4 text-center text-sm text-slate-500">
            Back to{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
