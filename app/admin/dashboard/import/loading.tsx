import { SkeletonBlock, SkeletonHeader } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-4 w-4" />
        <SkeletonBlock className="h-4 w-24" />
      </div>
      <SkeletonHeader />

      <div>
        <SkeletonBlock className="h-3 w-40 mb-3" />
        <div className="flex items-center justify-between p-4 rounded-xl bg-bgStatCard border border-borderCard">
          <div className="space-y-2 flex-1">
            <SkeletonBlock className="h-4 w-56" />
            <SkeletonBlock className="h-3 w-full max-w-md" />
          </div>
          <SkeletonBlock className="h-9 w-24" />
        </div>
      </div>

      <div>
        <SkeletonBlock className="h-3 w-32 mb-3" />
        <SkeletonBlock className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}
