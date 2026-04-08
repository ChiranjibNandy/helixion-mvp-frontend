// ─── Role Types ──────────────────────────────────────────────────────────────
export type UserRole = 'employee' | 'manager' | 'admin';

export type EnrollmentStatus = 'pending' | 'active' | 'completed'

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  userId: string;
  name: string;
  email: string;
  location:string;
  role: string
}

// ─── Enrollment ──────────────────────────────────────────────────────────────
export interface Enrollment {

  _id: string,
  userId: string,
  programId: string,
  status:EnrollmentStatus,
  enrolledAt: Date,
  programDetails:Programme
}


// ─── Programme ───────────────────────────────────────────────────────────────
export interface Programme {
  _id: string;
  name: string;
  description:string;
  duration: string;
  mode: string;
  location: string;
  status:string;
  fee:number
}

// ─── Nav Item ────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  key: string;
  href?: string;
}

export interface NavSection {
  category: string;
  items: NavItem[];
}

