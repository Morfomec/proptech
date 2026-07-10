// src/components/LoginHero.tsx
import { BarChart3, ShieldCheck, Building2 } from 'lucide-react';
import { APP } from '@/constants/app';

export function AuthHero() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-dark lg:flex">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80")' }}
      >
        <div className="absolute inset-0 bg-brand-dark/40 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-24">
        <div className="mb-8 w-fit inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(64,138,113,0.8)]"></span>
          Modern Property Management
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-sm">
          Manage your<br />
          properties <span className="text-brand-accent">with<br />ease.</span>
        </h1>
        
        <p className="mb-12 max-w-md text-lg leading-relaxed text-white/80 drop-shadow-sm">
          The ultimate platform for real estate professionals to streamline operations, enhance tenant experiences, and maximize ROI.
        </p>

        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-white drop-shadow-sm">
            <BarChart3 className="h-5 w-5 text-brand-primary" />
            Live Analytics
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white drop-shadow-sm">
            <ShieldCheck className="h-5 w-5 text-brand-primary" />
            Secure Portal
          </div>
        </div>
      </div>

      <div className="relative z-10 p-12 xl:p-24">
        <div className="flex items-center gap-3 text-white drop-shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/20">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">{ APP.NAME }</span>
        </div>
      </div>
    </div>
  );
}
