import { Navigate } from "react-router";
import { getAccessToken } from "@/utils/token";
import { ROUTES } from "@/features/auth/components/AuthFooter";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}