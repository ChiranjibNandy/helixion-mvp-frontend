# Helixion — Next.js 14 (JSX) Login Page

Pixel-perfect replica of the Helixion sign-in page built with **Next.js 14 App Router**, fully in **JSX** with proper component architecture.

---

## 🗂 Project Structure

```
helixion/
├── app/
│   ├── layout.jsx                     # Root layout + font import
│   └── page.jsx                       # Home page — composes Left + Right panels
│
├── components/
│   ├── ui/
│   │   └── Icons.jsx                  # All SVG icon components
│   │
│   ├── auth/
│   │   ├── RoleSelector.jsx           # 3-button role picker
│   │   ├── RoleChip.jsx               # Active role badge chip
│   │   ├── LoginForm.jsx              # Email/password form + submit
│   │   └── TrustBadges.jsx            # SOC2 / TLS / Uptime row
│   │
│   └── layout/
│       ├── LeftPanel.jsx              # Branding, stats, headline
│       └── RightPanel.jsx            # Assembles entire right form
│
├── styles/
│   └── globals.css                    # Tailwind + custom CSS
│
├── jsconfig.json                      # Path alias: @/ → root
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## ✅ Features Implemented

| Feature | Status |
|---------|--------|
| Bricolage Grotesque font — exact match | ✅ |
| Split layout — 44% left / 56% right | ✅ |
| Dot-grid texture + radial glow orbs | ✅ |
| "One platform. Three workspaces." headline | ✅ |
| Stats — 2.4M+ / 98% / 500+ | ✅ |
| 3-role selector with active blue highlight | ✅ |
| Dynamic role chip (e.g. "Reporting Manager / HoD") | ✅ |
| Work Email field with icon | ✅ |
| Password field with icon | ✅ |
| Custom-styled checkbox | ✅ |
| Forgot password link | ✅ |
| Blue gradient "Sign In as [Role]" CTA | ✅ |
| Loading spinner on submit | ✅ |
| OR divider + Corporate ID SSO button | ✅ |
| SOC 2 · 256-bit TLS · 99.9% Uptime badges | ✅ |
| Button label updates per selected role | ✅ |
| Fully responsive (left panel hides on mobile) | ✅ |

---

## 🛠 Tech Stack

| | |
|--|--|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript JSX |
| Styling | Tailwind CSS + custom CSS |
| Font | Bricolage Grotesque (Google Fonts) |
| State | React `useState` (client components) |
