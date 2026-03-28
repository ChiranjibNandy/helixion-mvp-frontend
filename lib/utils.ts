import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for composing Tailwind class names safely.
 *
 * WHY clsx + tailwind-merge (not just template literals):
 *
 *   Problem: Tailwind classes conflict silently.
 *   Example:  className={`p-2 ${isActive ? "p-4" : ""}`}
 *             → renders as "p-2 p-4" — Tailwind applies p-2 because
 *               last-wins order depends on the generated CSS, not the string.
 *
 *   `clsx` handles conditional class joining cleanly (no double spaces, no
 *   undefined/false values polluting the string).
 *
 *   `twMerge` resolves conflicting Tailwind utilities so the last one wins
 *   reliably — e.g. twMerge("p-2", "p-4") → "p-4", always.
 *
 *   Together they make className composition predictable and safe.
 *   This is a standard pattern in every production Tailwind codebase.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
