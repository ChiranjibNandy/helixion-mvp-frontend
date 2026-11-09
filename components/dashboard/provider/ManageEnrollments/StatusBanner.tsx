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
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
        This program has been cancelled.
      </div>
    );
  }

  if (belowMinimum) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
        Below Minimum — only {activeCount} enrolment{activeCount === 1 ? '' : 's'} received. Minimum required is {minParticipants}.
      </div>
    );
  }

  if (overEnrolled) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
        Over Enrolled — {activeCount} enrolments received. Maximum capacity is {maxParticipants}.
      </div>
    );
  }

  return null;
}
