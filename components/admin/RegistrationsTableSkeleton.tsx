import { Skeleton } from "@/components/ui/skeleton";

export function RegistrationsTableSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading registrations..." aria-busy="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-4 w-4 flex-shrink-0" />
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-3 w-24 hidden sm:block" />
          <div className="flex gap-2 flex-shrink-0">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
