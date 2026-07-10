import { BrowserRouter, Routes, Route, Navigate} from "react-router";
import ProtectedRoute from "./ProtectedRoute";

import { ROUTES } from "@/constants/routes";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { VerifyEmailPendingPage } from "@/features/auth/pages/VerifyEmailPendingPage";
import { VerifyEmailResultPage } from "@/features/auth/pages/VerifyEmailResultPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { ResetPasswordSuccessPage } from "@/features/auth/pages/ResetPasswordSuccessPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path={ROUTES.VERIFICATION_PENDING} element={<VerifyEmailPendingPage />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmailResultPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD_SUCCESS} element={<ResetPasswordSuccessPage />} />
        <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}