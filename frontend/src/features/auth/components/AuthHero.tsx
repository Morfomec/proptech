// src/components/LoginHero.tsx
import { BarChart3, ShieldCheck, Building2 } from 'lucide-react';

export function AuthHero() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 lg:flex">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80")' }}
      >
        <div className="absolute inset-0 bg-emerald-950/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-24">
        <div className="mb-8 w-fit inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Modern Property Management
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white">
          Manage your<br />
          properties <span className="text-emerald-400">with<br />ease.</span>
        </h1>
        
        <p className="mb-12 max-w-md text-lg leading-relaxed text-emerald-100/80">
          The ultimate platform for real estate professionals to streamline operations, enhance tenant experiences, and maximize ROI.
        </p>

        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            Live Analytics
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Secure Portal
          </div>
        </div>
      </div>

      <div className="relative z-10 p-12 xl:p-24">
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">PropTech</span>
        </div>
      </div>
    </div>
  );
}
