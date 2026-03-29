import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors (existing + structured)
        primary: '#4f7cff',
        primaryDark: '#3b5bdb',
        primaryDarker: '#2f4cc4',

        // (optional compatibility with your blue scale)
        blue: {
          500: '#4f7cff',
          600: '#3b5bdb',
          700: '#2f4cc4',
        },

        // Background system (Deep Navy/Slate from design)
        bgMain: '#0b1120',
        bgCard: '#131b2f',
        bgSidebar: '#0b1120',
        inputBg: '#111827',
        bgHover: '#1c263b',

        // Borders & UI
        borderDark: '#1e293b',
        borderLight: '#334155',

        // Text system
        textMuted: '#94a3b8',
        textSecondary: '#cbd5e1',
        textPrimary: '#f8fafc',

        // Accent & Status colors from screenshots
        accentBlue: '#3b82f6',     // Primary blue for selections
        accentYellow: '#facc15',   // Yellow for stars and UI accents
        statusPending: '#eab308',  // Yellow for pending
        statusPendingBg: 'rgba(234, 179, 8, 0.1)',
        statusActive: '#22c55e',   // Green for active
        statusActiveBg: 'rgba(34, 197, 94, 0.1)',
        statusInactive: '#ef4444', // Red for inactive
        statusInactiveBg: 'rgba(239, 68, 68, 0.1)',
        roleManager: '#a855f7',    // Purple for Manager
      },

      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },

      //  Custom shadows (for AuthButton etc.)
      boxShadow: {
        glow: '0 4px 20px rgba(59,91,219,0.35)',
      },

      //  Gradient support (optional but clean)
      backgroundImage: {
        primaryGradient: 'linear-gradient(135deg, #3b5bdb 0%, #4f7cff 100%)',
      },
    },
  },
  plugins: [],
};

export default config;