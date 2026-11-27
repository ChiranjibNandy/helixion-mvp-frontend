import type { Config } from "tailwindcss";

const themeColor = (token: string) =>
  `color-mix(in srgb, var(${token}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./constants/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: themeColor("--primary"),
          foreground: themeColor("--primary-foreground"),
        },
        primaryDark: themeColor("--primary-dark"),
        primaryDarker: themeColor("--primary-darker"),
        link: themeColor("--link"),

        bgMain: themeColor("--bg-main"),
        bgCard: themeColor("--bg-card"),
        bgSidebar: themeColor("--bg-sidebar"),
        bgStatCard: themeColor("--bg-stat-card"),
        bgNavActive: themeColor("--bg-nav-active"),
        bgButton: themeColor("--bg-button"),
        bgButtonHover: themeColor("--bg-button-hover"),
        inputBg: themeColor("--input-bg"),
        surface: {
          DEFAULT: themeColor("--surface"),
          muted: themeColor("--surface-muted"),
        },
        header: {
          DEFAULT: themeColor("--header-from"),
          foreground: themeColor("--header-foreground"),
        },
        accent: {
          DEFAULT: themeColor("--accent"),
          foreground: themeColor("--accent-foreground"),
          yellow: themeColor("--accent-yellow"),
          green: themeColor("--accent-green"),
          greenHover: themeColor("--accent-green-hover"),
          red: themeColor("--accent-red"),
          redHover: themeColor("--accent-red-hover"),
          orange: themeColor("--accent-orange"),
        },

        // Borders
        border: themeColor("--border"),
        borderDark: themeColor("--border-dark"),
        borderSidebar: themeColor("--border-sidebar"),
        borderCard: themeColor("--border-card"),
        borderNav: themeColor("--border-nav"),

        // Text
        foreground: themeColor("--foreground"),
        textMuted: themeColor("--text-muted"),
        textSecondary: themeColor("--text-secondary"),
        textSidebar: themeColor("--text-sidebar"),
        textSidebarMuted: themeColor("--text-sidebar-muted"),
        accentYellow: themeColor("--accent-yellow"),
        accentGreen: themeColor("--accent-green"),
        accentGreenHover: themeColor("--accent-green-hover"),
        accentRed: themeColor("--accent-red"),
        accentRedHover: themeColor("--accent-red-hover"),
        accentOrange: themeColor("--accent-orange"),

        // Avatar backgrounds and their accessible foreground
        avatarBlue: themeColor("--avatar-blue"),
        avatarGreen: themeColor("--avatar-green"),
        avatarOrange: themeColor("--avatar-orange"),
        avatarYellow: themeColor("--avatar-yellow"),
        avatarForeground: themeColor("--avatar-foreground"),

        background: themeColor("--background"),
        card: {
          DEFAULT: themeColor("--card"),
          foreground: themeColor("--card-foreground"),
        },
        muted: {
          DEFAULT: themeColor("--muted"),
          foreground: themeColor("--muted-foreground"),
        },
        destructive: {
          DEFAULT: themeColor("--destructive"),
          foreground: themeColor("--destructive-foreground"),
        },
        secondary: {
          DEFAULT: themeColor("--secondary"),
          foreground: themeColor("--secondary-foreground"),
        },
        input: themeColor("--input"),
        ring: themeColor("--ring"),
        sidebar: {
          DEFAULT: themeColor("--sidebar"),
          foreground: themeColor("--sidebar-foreground"),
          primary: themeColor("--sidebar-primary"),
          "primary-foreground": themeColor("--sidebar-primary-foreground"),
          accent: themeColor("--sidebar-accent"),
          "accent-foreground": themeColor("--sidebar-accent-foreground"),
          border: themeColor("--sidebar-border"),
          ring: themeColor("--sidebar-ring"),
        },
        chart: {
          1: themeColor("--chart-1"),
          2: themeColor("--chart-2"),
          3: themeColor("--chart-3"),
          4: themeColor("--chart-4"),
          5: themeColor("--chart-5"),
        },
      },

      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
      },

      boxShadow: {
        glow: "0 4px 20px var(--primary)",
      },

      backgroundImage: {
        "header-gradient": "var(--header-gradient)",
        primaryGradient: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;