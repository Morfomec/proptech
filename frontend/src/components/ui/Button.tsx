// src/components/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
}

export function Button({ variant = 'primary', children, icon, isLoading = false, className = '', ...props }: ButtonProps) {
  const baseStyles = "flex items-center justify-center w-full gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary";
  const variants = {
    primary: "bg-brand-primary text-white shadow-sm hover:bg-brand-secondary hover:shadow",
    outline: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
  };

  return (
    <button 
        disabled={isLoading || props.disabled}
        className={`${baseStyles} ${variants[variant]} ${className}`} 
        {...props}>
        {isLoading ? "Loading..." : (
            <>
                {icon}
                {children}
            </>
        )}
    </button>
  );
}
