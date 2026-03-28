// ─────────────────────────────────────────────────────────────────────────────
// Avatar and display utilities for user entities.
// ─────────────────────────────────────────────────────────────────────────────

// Precomputed — this array never changes, so allocating it once at module
// load time is intentional (not a magic inline array on every call).
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
] as const;

/**
 * Deterministic string → integer hash (djb2-variant).
 *
 * Private by design — `getAvatarColor` is the public API. Callers never need
 * the raw hash; exposing it would invite misuse.
 */
function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // Bitwise left-shift is intentional: fast integer hash, signed 32-bit.
    hash = (str.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  return hash;
}

/**
 * Maps a name to a deterministic CSS gradient.
 * The same name always yields the same color — no server-side storage needed.
 */
export function getAvatarColor(name: string): string {
  if (!name) return AVATAR_GRADIENTS[0];
  const index = Math.abs(hashStringToInt(name)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

/**
 * Extracts 1–2 uppercase initials from a full name.
 *
 * Examples:
 *   "John Doe"     → "JD"
 *   "Alice"        → "A"   (single word → single initial; not "AL")
 *   "  "           → "?"   (empty/whitespace-only)
 *   "Mary Jane W." → "MJ"  (sliced to 2)
 */
export function getInitials(name: string): string {
  const trimmed = name?.trim();
  if (!trimmed) return "?";
  return trimmed
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Formats an ISO 8601 date string for display.
 *
 * @returns Formatted date string (e.g. "Jan 15, 2024"), or "Unknown date"
 *          if the input is not a valid date — prevents "Invalid Date" leaking
 *          into the UI.
 *
 * @example
 *   formatRegistrationDate("2024-01-15T10:00:00Z") → "Jan 15, 2024"
 *   formatRegistrationDate("not-a-date")           → "Unknown date"
 */
export function formatRegistrationDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    // Log in dev so engineers notice bad data; silent fallback in prod.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[formatRegistrationDate] Received invalid date string: "${isoString}"`
      );
    }
    return "Unknown date";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
