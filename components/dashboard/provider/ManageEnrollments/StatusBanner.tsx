interface StatusBannerProps {
  isCancelled: boolean;
  belowMinimum: boolean;
  overEnrolled: boolean;
  activeCount: number;
  minParticipants?: number;
  maxParticipants?: number;
}

export default function StatusBanner({
  isCancelled,
  belowMinimum,
  overEnrolled,
  activeCount,
  minParticipants,
  maxParticipants,
}: StatusBannerProps) {
  if (isCancelled) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
        This program has been cancelled.
      </div>
    );
  }

  if (belowMinimum) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-400">
        Below Minimum — only {activeCount} enrolment{activeCount === 1 ? '' : 's'} received. Minimum required is {minParticipants}.
      </div>
    );
  }

  if (overEnrolled) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
        Over Enrolled — {activeCount} enrolments received. Maximum capacity is {maxParticipants}.
      </div>
    );
  }

  return null;
}
