# Admin Dashboard Components

## Overview
Two-screen admin dashboard for managing pending user registrations with role assignment capabilities.

## Files Created

### Types & API
- `types/registration.ts` - TypeScript types (User, Role, PaginatedResponse)
- `lib/api/registrations.ts` - API functions (getRegistrations, approveUser)
- `lib/utils.ts` - Utility function for className merging

### UI Components (shadcn/ui)
- `components/ui/skeleton.tsx`
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/badge.tsx`
- `components/ui/textarea.tsx`
- `components/ui/checkbox.tsx`
- `components/ui/dialog.tsx`

### Admin Components
- `components/admin/RegistrationsTable.tsx` + `.module.css` - Main table component
- `components/admin/UserRow.tsx` + `.module.css` - Individual table row
- `components/admin/ApproveModal.tsx` + `.module.css` - Role assignment modal
- `components/admin/RoleCard.tsx` - Role selection card
- `components/admin/SkeletonTable.tsx` - Loading skeleton
- `components/admin/EmptyState.tsx` - Empty state UI

### Providers & Pages
- `components/providers/QueryProvider.tsx` - React Query provider
- `app/admin/registrations/page.tsx` - Example usage page
- `app/layout.tsx` - Updated with QueryProvider wrapper

## Dependencies Added
```json
{
  "@tanstack/react-query": "^5.28.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.2"
}
```

## Installation
```bash
npm install
```

## Usage
Navigate to `/admin/registrations` to view the dashboard.

## Features Implemented

### RegistrationsTable
- Pagination (5 users per page)
- Debounced search (300ms)
- Bulk selection with checkboxes
- Loading skeleton state
- Empty state when no users
- Optimistic UI updates
- Error handling with rollback

### ApproveModal
- 4 role options in 2x2 grid
- Purple border highlight on selection
- Optional note textarea
- Disabled confirm button until role selected
- Optimistic removal from list on approval

### UserRow
- Unique colored avatar with initials
- Formatted registration date
- Approve/Deny action buttons
- Hover state

## API Contracts

### GET /api/admin/registrations
Query params: `page`, `limit`, `search` (optional)
Response:
```typescript
{
  users: User[]
  total: number
  page: number
  limit: number
}
```

### PATCH /api/admin/users/:id
Body:
```typescript
{
  role: "employee" | "training_provider" | "manager" | "admin"
  note?: string
}
```

## Coding Standards Followed
- No inline styles
- No emojis
- No unnecessary comments
- Separate .module.css for custom styles
- All API calls in /lib/api
- All types in /types
- React Query for data fetching
- Strict TypeScript (no any types)
- Named exports only
