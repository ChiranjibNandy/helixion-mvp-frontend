/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Background colors
        background: {
          main: '#060d1a',
          secondary: '#08101e',
          tertiary: '#0c1828',
          input: '#0c1828',
          card: 'rgba(8,16,30,0.6)',
        },
        // Text colors
        text: {
          primary: '#e8edf5',
          secondary: '#c8d4e8',
          tertiary: '#7a8faa',
          muted: '#6b7d96',
          placeholder: '#3a4f6a',
        },
        // Border colors
        border: {
          primary: '#1a2d45',
          secondary: '#0c1b30',
          error: 'rgba(239,68,68,0.5)',
        },
        // Semantic colors
        error: {
          DEFAULT: '#f87171',
          background: 'rgba(239,68,68,0.1)',
          border: 'rgba(239,68,68,0.25)',
        },
        success: {
          DEFAULT: '#22c55e',
          background: 'rgba(34,197,94,0.12)',
          border: 'rgba(34,197,94,0.3)',
        },
        // Legacy support
        blue: {
          DEFAULT: '#3b6fe0',
          light: '#4d7ef5',
          dim: 'rgba(59,111,224,0.18)',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        'input': '14px',
        'label': '6px',
      },
      fontSize: {
        '2xs': '10.5px',
        '3xl': '28px',
        '4xl': '44px',
      },
      fontWeight: {
        extrabold: 800,
      },
      letterSpacing: {
        tightest: '-1.5px',
        wider: '0.12em',
        widest: '0.08em',
      },
      borderRadius: {
        'input': '12px',
        'card': '16px',
      },
      boxShadow: {
        'glow': '0 0 0 3px rgba(59,111,224,0.25)',
        'primary': '0 4px 20px rgba(42,92,232,0.45)',
        'primary-hover': '0 6px 28px rgba(42,92,232,0.55)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2a5ce8 0%, #1e4bd4 100%)',
        'gradient-secondary': 'linear-gradient(158deg, #071022 0%, #07122a 45%, #060d1c 100%)',
        'gradient-logo': 'linear-gradient(135deg, #2554c7 0%, #1e40af 100%)',
        'gradient-divider': 'linear-gradient(90deg, rgba(59,111,224,0.35), rgba(255,255,255,0.05) 60%, transparent)',
        'dot-grid': 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '28px 28px',
      },
      transitionDuration: {
        '250': '250ms',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease both',
        'spin-fast': 'spin 0.65s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
