import { TableRow, TableCell } from '@/components/ui/table';

/** Base pulsing block — the primitive every skeleton layout below is built from. */
export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-white/[0.06] ${className}`} />;
}

/**
 * Drop-in replacement for a "Loading..." <TableRow> — renders skeleton rows
 * using the same Table/TableRow/TableCell components the real data uses, so
 * it lines up column-for-column instead of a single generic loading message.
 * For the gap between a page finishing its route transition and its own
 * useEffect-driven fetch resolving (loading.tsx only covers the former).
 */
export function TableRowsSkeleton({ rows = 5, columns }: { rows?: number; columns: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <TableRow key={r} className="border-white/5 hover:bg-transparent">
          {Array.from({ length: columns }).map((_, c) => (
            <TableCell key={c} className="py-3.5">
              <SkeletonBlock className={`h-4 ${c === 0 ? 'w-24' : 'w-20'}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

/** Matches the page-header pattern used across admin pages (breadcrumb + title + description). */
export function SkeletonHeader() {
  return (
    <div className="mb-6 space-y-3">
      <SkeletonBlock className="h-4 w-40" />
      <SkeletonBlock className="h-6 w-64" />
      <SkeletonBlock className="h-4 w-96 max-w-full" />
    </div>
  );
}

/** Matches the search-bar + results-table pattern used on Deactivate, Organizations, etc. */
export function TableSkeleton({ rows = 6, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full px-8 pt-8 pb-4">
      <SkeletonHeader />

      <div className="mb-8 flex gap-3">
        <SkeletonBlock className="h-10 flex-1" />
        <SkeletonBlock className="h-10 w-24" />
      </div>

      <SkeletonBlock className="h-4 w-32 mb-4" />

      <div className="bg-bgStatCard border border-borderCard rounded-xl overflow-hidden">
        <div className="flex border-b border-white/5 px-6 py-3 gap-6">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonBlock key={i} className="h-3 w-16" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center border-b border-white/[0.03] px-6 py-3.5 gap-6">
            {Array.from({ length: columns }).map((_, c) => (
              <SkeletonBlock key={c} className={`h-4 ${c === 0 ? 'w-20' : 'w-24'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Matches the grouped-card form pattern used on Add Employee / Edit Employee / Org Policy Setup. */
export function FormSkeleton({ groups = 3 }: { groups?: number }) {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-4 w-4" />
        <SkeletonBlock className="h-4 w-28" />
      </div>
      <SkeletonHeader />

      <div className="max-w-2xl space-y-6">
        {Array.from({ length: groups }).map((_, g) => (
          <div key={g} className="rounded-xl bg-bgStatCard border border-borderCard p-6 space-y-4">
            <SkeletonBlock className="h-4 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonBlock className="h-10" />
              <SkeletonBlock className="h-10" />
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <SkeletonBlock className="h-10 w-32" />
          <SkeletonBlock className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
}

/** Matches the stat-cards + two-column dashboard layout on /admin/dashboard. */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-bgStatCard border border-borderCard p-5 space-y-3">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-7 w-14" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6 my-4">
        <div className="col-span-2 rounded-xl bg-bgStatCard border border-borderCard p-5 space-y-4">
          <SkeletonBlock className="h-4 w-40" />
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="rounded-xl bg-bgStatCard border border-borderCard p-5 space-y-4">
          <SkeletonBlock className="h-4 w-28" />
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
