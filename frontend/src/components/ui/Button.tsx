// src/components/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: ReactNode;
  icon?: ReactNode;
}

export function Button({ variant = 'primary', children, icon, className = '', ...props }: ButtonProps) {
  const baseStyles = "flex items-center justify-center w-full gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500";
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
  };

  return (
    <button 
        className={`${baseStyles} ${variants[variant]} ${className}`} 
        {...props}>
        {icon}
        {children}
    </button>
  );
}
