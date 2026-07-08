// src/components/Input.tsx
import { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ label, icon, rightIcon, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${
            icon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}
