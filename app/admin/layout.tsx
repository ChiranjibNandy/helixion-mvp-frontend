import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import type { User } from '@/types';
import { decodeJwtPayload, getAccessToken } from '@/utils/token';
import { redirect } from 'next/navigation';
import { ADMIN_NAV_SECTION } from '@/constants/admin';
import { ROUTES } from '@/constants/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Ticket 0041 — org-dependent nav items (Bulk Import) stay disabled until an
// organization with a saved policy exists. Fetched server-side here (not via
// the shared `api` axios instance, which reads its token from a browser
// cookie and can't run in a server component) since this layout already
// reads the access token server-side for the JWT payload above.
// Fails open (treats status as "set up") on any error — this is a soft UX
// nudge, not a security boundary, so a transient status-check failure
// shouldn't spuriously lock out a working feature.
async function getHasOrgPolicySetup(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/organizations/status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return true;
    const body = await res.json();
    return body?.data?.hasOrgPolicySetup ?? true;
  } catch {
    return true;
  }
}

export default async function AdminLayout({ children }: DashboardLayoutProps) {
  const token = await getAccessToken();
  if (!token) redirect(ROUTES.AUTH.SIGNIN);

  const payload = await decodeJwtPayload(token);

  const user: User = {
    userId: payload.userId,
    name: payload.name,
    email: payload.email,
    location: payload.location,
    role: payload.orgRole,
    permissions: payload.permissions,
  };

  const hasOrgPolicySetup = await getHasOrgPolicySetup(token);

  const navSections = ADMIN_NAV_SECTION.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.key === 'import' && !hasOrgPolicySetup
        ? { ...item, disabled: true, disabledReason: 'Complete Org Policy Setup first' }
        : item
    ),
  }));

  return (
    <DashboardShell
      user={user}
      navSections={navSections}
      defaultActiveKey="dashboard"
    >
      {children}
    </DashboardShell>
  );
}