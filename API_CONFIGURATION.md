# API Configuration Guide

## Problem Solved

**Previous behavior:**
- API calls went to: `http://localhost:3000/api/admin/registrations?page=1&limit=5`
- This was calling Next.js API routes (which don't exist)
- No authentication token was being sent (401 Unauthorized error)

**New behavior:**
- Development: `http://localhost:5000/api/admin/registrations?page=1&limit=10`
- Production: `https://helixion-mvp-backend.onrender.com/api/admin/registrations?page=1&limit=10`
- Authentication token automatically attached via axios interceptor

## Files Changed

### 1. `lib/api/registrations.ts` (UPDATED)
**Changes:**
- Replaced `fetch` with axios instance: `import API from "@/lib/api";`
- Changed default limit: `limit: number = 10` (was 5)
- Updated to use axios methods:
  - Before: `fetch('/api/admin/registrations')`
  - After: `API.get('/api/admin/registrations', { params })`
  - Before: `fetch('/api/admin/users/${userId}', { method: 'PATCH', body: ... })`
  - After: `API.patch('/api/admin/users/${userId}', payload)`

**Purpose:** 
- Uses existing axios instance from `lib/api.ts` which has authentication interceptor
- Automatically attaches `Authorization: Bearer <token>` header from localStorage
- All API calls now use the configured backend URL instead of Next.js routes

### 3. `components/admin/RegistrationsTable.tsx` (UPDATED)
**Changes:**
- Changed: `const limit = 10;` (was 5)

**Purpose:** Matches the required limit of 10 users per page.

### 4. `.env.example` (NEW)
Template file showing required environment variables.

## Setup Instructions

### Step 1: Create `.env.local` file
Create a new file named `.env.local` in the project root:

```bash
# For Development
NEXT_PUBLIC_API_URL=http://localhost:5000

# For Production (when deploying)
# NEXT_PUBLIC_API_URL=https://helixion-mvp-backend.onrender.com
```

**Note:** This uses the existing `NEXT_PUBLIC_API_URL` variable that's already configured in `lib/api.ts`.

### Step 2: Restart Development Server
```bash
npm run dev
```

### Step 3: Verify
Visit `http://localhost:3000/admin/registrations`

Check browser Network tab - you should see:
```
Request URL: http://localhost:5000/api/admin/registrations?page=1&limit=10
```

## Environment Variables Explained

### `NEXT_PUBLIC_API_URL`
- **Prefix `NEXT_PUBLIC_`**: Required for client-side access in Next.js
- **Development**: `http://localhost:5000`
- **Production**: `https://helixion-mvp-backend.onrender.com`

Without the `NEXT_PUBLIC_` prefix, the variable won't be available in browser/client components.

## Authentication

The axios instance in `lib/api.ts` automatically:
1. Reads `accessToken` from localStorage
2. Attaches it as `Authorization: Bearer <token>` header to all requests
3. Handles CORS with `withCredentials: true`

Make sure the user is logged in and has a valid token in localStorage before accessing admin routes.

## Production Deployment

When deploying to Vercel/Netlify/etc:

1. Add environment variable in deployment settings:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://helixion-mvp-backend.onrender.com`

2. Redeploy the application

## Troubleshooting

### Issue: Still hitting localhost:3000
**Solution:** Restart the dev server after creating `.env.local`

### Issue: CORS errors
**Solution:** Ensure your backend at `localhost:5000` or `helixion-mvp-backend.onrender.com` has CORS enabled for your frontend domain.

### Issue: 404 errors
**Solution:** Verify your backend API endpoints match:
- `GET /api/admin/registrations`
- `PATCH /api/admin/users/:id`

## Summary

**2 files changed:**
1. ✅ `lib/api/registrations.ts` - Updated to use axios with auth token + limit=10
2. ✅ `components/admin/RegistrationsTable.tsx` - Changed limit to 10

**1 file to create manually:**
- `.env.local` - Add `NEXT_PUBLIC_API_URL=http://localhost:5000`

**Key points:**
- Now uses existing axios instance from `lib/api.ts`
- Authentication token automatically attached from localStorage
- No need for separate config file - axios already handles baseURL
