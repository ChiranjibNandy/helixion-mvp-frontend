# Admin Dashboard

## Overview
Pixel-perfect admin dashboard implementation matching the provided screenshot design.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Lucide React (icons)
- TypeScript

## Project Structure
```
app/
├── admin/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard page
│   └── layout.tsx             # Admin layout wrapper

components/
└── dashboard/
    ├── Sidebar.tsx            # Left navigation sidebar
    ├── DashboardHeader.tsx    # Top header with notifications
    ├── StatCard.tsx           # Reusable stat card component
    ├── PendingRegistrations.tsx # Registrations table section
    ├── RegistrationRow.tsx    # Individual registration row
    ├── RecentActivity.tsx     # Activity feed section
    ├── ActivityItem.tsx       # Individual activity item
    └── EmptySection.tsx       # Placeholder sections
```

## Features
- **Responsive Layout**: Sidebar + main content area
- **Stats Overview**: 4 stat cards showing key metrics
- **Pending Registrations**: Table with approve/deny actions
- **Recent Activity**: Timeline of recent events
- **API Integration**: Fetches data from `/api/admin/registrations`

## Color Palette
- Background Main: `#080c18`
- Card Background: `#0f1629`
- Border: `#1a2235`
- Primary Blue: `#4f7cff`
- Text Muted: `#6b7280`
- Success Green: `#16a34a`
- Error Red: `#dc2626`
- Warning Orange: `#f59e0b`

## Usage
Navigate to `/admin/dashboard` to view the admin dashboard.

## Backend Integration

This dashboard fetches data **directly** from your Express backend (no Next.js API routes).

### Environment Setup
Add to your `.env` file:
```
NEXT_PUBLIC_API_URL=http://localhost:YOUR_EXPRESS_PORT
```

Default: `http://localhost:5000`

### Required Express API Endpoint
Your Express backend must expose:

**GET** `/api/admin/registrations`

Expected response format:
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "date": "ISO date string"
  }
]
```

The dashboard page fetches directly from `${NEXT_PUBLIC_API_URL}/api/admin/registrations`.

## Components

### StatCard
Displays a metric with title, value, and subtitle.

### PendingRegistrations
Fetches and displays pending user registrations with approve/deny buttons.

### RecentActivity
Shows timeline of recent platform activities with colored status indicators.

### Sidebar
Full navigation menu with sections: Overview, Management, Platform, General tools.

## Customization
All colors are defined in `tailwind.config.ts` and can be easily customized.
