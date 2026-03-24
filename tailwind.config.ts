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

        // Background system
        bgMain: '#080c18',
        bgCard: '#0a0f1e',
        inputBg: '#111827',

        //  Borders & UI
        borderDark: '#1f2937',

        //  Text system
        textMuted: '#9ca3af',
        textSecondary: '#d1d5db',

        //  Accent
        accentYellow: '#facc15',
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