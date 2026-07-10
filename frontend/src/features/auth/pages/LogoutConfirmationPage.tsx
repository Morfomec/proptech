import { LogoutConfirmationUI } from "@/features/auth/components/LogoutConfirmationUI";
import { useNavigate } from "react-router";

export function LogoutConfirmationPage() {
  const navigate = useNavigate();
  
  // Example wrapper for the page route approach if not used as a modal
  const handleConfirm = () => {
    console.log("Logging out...");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <LogoutConfirmationUI 
        onConfirm={handleConfirm} 
        onCancel={handleCancel} 
      />
    </div>
  );
}
