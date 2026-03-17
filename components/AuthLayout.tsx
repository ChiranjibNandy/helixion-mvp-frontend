'use client';

import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface AuthLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export default function AuthLayout({ leftPanel, rightPanel }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col relative overflow-hidden"
        style={{ backgroundColor: '#0a0f1e' }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(59,91,219,0.13) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #3b5bdb 0%, #4f7cff 100%)' }}
            >
              Hx
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">Helix<span style={{ color: '#4f7cff' }}>i</span>on</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-10">
          {leftPanel}
        </div>

        {/* Footer */}
        <div className="relative z-10 px-10 pb-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} style={{ color: '#4f7cff' }} />
            <span className="text-xs" style={{ color: '#4f7cff' }}>
              Best practice for enterprise multi-role SaaS platforms
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="flex-1 lg:w-3/5 flex flex-col"
        style={{ backgroundColor: '#080c18' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden p-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #3b5bdb 0%, #4f7cff 100%)' }}
            >
              Hx
            </div>
            <span className="text-white font-semibold text-base tracking-tight">Helixion</span>
          </div>
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
