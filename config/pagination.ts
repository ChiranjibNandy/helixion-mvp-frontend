/**
 * Shared pagination constants.
 *
 * WHY a dedicated file:
 *   ITEMS_PER_PAGE was previously duplicated in both `useRegistrations.ts`
 *   and `RegistrationsTable.tsx`. Any divergence would silently produce
 *   incorrect "Showing X–Y of Z" counts. One file, one value.
 */
export const REGISTRATIONS_PAGE_LIMIT = 10;
