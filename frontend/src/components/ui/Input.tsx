import { forwardRef, type ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, rightIcon, onRightIconClick, className = "", ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all shadow-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary ${
              icon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""} ${className}`}
            {...props}
          />

          {rightIcon && (
            <div
                onClick={onRightIconClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                >
                    {rightIcon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";