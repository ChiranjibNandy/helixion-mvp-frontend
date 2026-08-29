'use client';

import { ShieldCheck, Star } from 'lucide-react';
import { BRAND, SIGNIN_CONTENT } from '@/constants/content';

const BADGE_ICONS = { shield: ShieldCheck, star: Star } as const;

function TopBar() {
  const { LOGO_SHORT, NAME, TAGLINE } = BRAND;

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-primaryDark to-primary">
          {LOGO_SHORT}
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">{NAME}</span>
        <span className="hidden sm:inline text-sm text-textMuted ml-2 pl-3 border-l border-borderDark">
          {TAGLINE}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {SIGNIN_CONTENT.BADGES.map((badge) => {
          const Icon = BADGE_ICONS[badge.icon];
          return (
            <span
              key={badge.label}
              className="flex items-center gap-1.5 rounded-full border border-borderDark px-3 py-1.5 text-xs font-medium text-textMuted"
            >
              <Icon size={13} className={badge.icon === 'star' ? 'text-accentYellow fill-accentYellow' : 'text-primary'} />
              {badge.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Footer() {
  const { COPYRIGHT, LINKS } = SIGNIN_CONTENT.FOOTER;

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-6 sm:px-10 border-t border-borderDark/60 text-xs text-textMuted">
      <span>{COPYRIGHT}</span>
      <div className="flex items-center gap-5">
        {LINKS.map((link) => (
          <span key={link} className="cursor-default hover:text-white transition-colors">
            {link}
          </span>
        ))}
      </div>
    </div>
  );
}

type AuthSceneProps = {
  marketing: React.ReactNode;
  card: React.ReactNode;
};

/**
 * Shared full-bleed backdrop for the sign-in / sign-up pages: real skyline
 * photo + dark scrim (so copy on the left stays legible regardless of what's
 * behind it) + top bar + footer, with a two-column slot for page-specific
 * marketing copy and the auth form card.
 */
export default function AuthScene({ marketing, card }: AuthSceneProps) {
  return (
    <div className="relative min-h-screen flex flex-col font-sans overflow-hidden bg-bgMain">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/auth-skyline.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,7,15,0.96) 0%, rgba(5,7,15,0.88) 35%, rgba(5,7,15,0.55) 65%, rgba(5,7,15,0.35) 100%)',
        }}
        aria-hidden="true"
      />

      <TopBar />

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 px-6 sm:px-10 py-8 lg:py-12">
        <div className="flex-1 flex items-center w-full">{marketing}</div>
        <div className="flex items-center justify-center w-full lg:w-auto lg:mr-10 xl:mr-16">{card}</div>
      </div>

      <Footer />
    </div>
  );
}
