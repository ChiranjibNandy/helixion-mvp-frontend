import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Your existing names (unchanged) ──────────────────────────
        primary: '#4f7cff',
        primaryDark: '#3b5bdb',
        primaryDarker: '#2f4cc4',
        blue: {
          500: '#4f7cff',
          600: '#3b5bdb',
          700: '#2f4cc4',
        },
        bgMain: '#080c18',
        bgCard: '#0a0f1e',
        inputBg: '#111827',
        borderDark: '#1f2937',
        textMuted: '#9ca3af',
        textSecondary: '#d1d5db',
        accentYellow: '#facc15',

        // ── shadcn/ui variable mappings (new) ────────────────────────
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 4px 20px rgba(59,91,219,0.35)',
      },
      backgroundImage: {
        primaryGradient: 'linear-gradient(135deg, #3b5bdb 0%, #4f7cff 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;