import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LogoutConfirmationUIProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LogoutConfirmationUI({ onConfirm, onCancel, isLoading }: LogoutConfirmationUIProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <LogOut className="h-6 w-6 text-red-600" />
        </div>
        
        <h2 className="mb-2 text-xl font-bold text-slate-900">
          Ready to leave?
        </h2>
        
        <p className="mb-6 text-sm text-slate-500">
          Are you sure you want to log out of your account? You will need to enter your credentials to log back in.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
