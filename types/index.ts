import { LucideIcon } from "lucide-react";


// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  userId: string;
  name: string;
  email: string;
  location: string;
  role: string; 
}

// ─── Enrollment ──────────────────────────────────────────────────────────────
export interface Enrollment {
  _id: string;
  userId: string;
  programId: string;
  status: "pending" | "active" | "completed";
  enrolledAt: Date;
  programDetails: Programme;
}

// ─── Programme ───────────────────────────────────────────────────────────────
export interface Programme {
  _id: string;
  name: string;
  description: string;
  duration: string;
  mode: string;
  location: string;
  status: string; 
  fee: number;
}

// ─── Nav Item ────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  key: string;
  href?: string;
  icon: LucideIcon;
}