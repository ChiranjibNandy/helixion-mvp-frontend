'use client';

import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import styles from './AuthLayout.module.css';
import { BRAND } from '@/constants/content';

type AuthLayoutProps = {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
};

/**
 * Authentication layout with left/right panel structure
 */
export default function AuthLayout({ leftPanel, rightPanel }: AuthLayoutProps) {
  const { LOGO_SHORT, NAME } = BRAND;

  return (
    <div className="min-h-screen flex font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-2/5 flex-col relative overflow-hidden bg-bgCard">
        <div
          className={`absolute inset-0 pointer-events-none ${ styles.authGlow }`}
        />

        {/* LOGO */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-primaryDark to-primary">
              {LOGO_SHORT}
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              {NAME.slice(0, 5)}<span className="text-primary">{NAME[5]}</span>{NAME.slice(6)}
            </span>
          </div>
        </div>

        {/* LEFT CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-10">
          {leftPanel}
        </div>

        {/* FOOTER */}

        {/* 
        best practice for enterprise multirole saas platform  */
        }

        {/* <div className="relative z-10 px-10 pb-8 flex items-center gap-2">
          <CheckCircle2 size={15} className="text-primary" />
          <span className="text-xs text-primary">
  
          </span>
        </div> */}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 lg:w-3/5 flex flex-col bg-bgMain">

        {/* MOBILE LOGO */}
        <div className="lg:hidden p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-primaryDark to-primary">
            {LOGO_SHORT}
          </div>
          <span className="text-white font-semibold text-base">
            {NAME}
          </span>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{rightPanel}</div>
        </div>
      </div>
    </div>
  );
}