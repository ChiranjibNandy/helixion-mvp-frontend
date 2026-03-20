'use client';

import { CheckCircle2 } from 'lucide-react';

export default function AuthLayout({ leftPanel, rightPanel }: any) {
  return (
    <div className="min-h-screen flex font-sans">
      
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-2/5 flex-col relative overflow-hidden bg-bgCard">
        
        <div className="absolute inset-0 pointer-events-none 
          bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(59,91,219,0.13)_0%,transparent_70%)]" 
        />

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-primaryDark to-primary">
              Hx
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Helix<span className="text-primary">i</span>on
            </span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-10">
          {leftPanel}
        </div>

        <div className="relative z-10 px-10 pb-8 flex items-center gap-2">
          <CheckCircle2 size={15} className="text-primary" />
          <span className="text-xs text-primary">
            Best practice for enterprise multi-role SaaS platforms
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 lg:w-3/5 flex flex-col bg-bgMain">
        
        <div className="lg:hidden p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-primaryDark to-primary">
            Hx
          </div>
          <span className="text-white font-semibold text-base">Helixion</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {rightPanel}
          </div>
        </div>
      </div>
    </div>
  );
}