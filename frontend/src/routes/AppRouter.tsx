import { BrowserRouter, Routes, Route, Navigate} from "react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}