import type { Enrollment } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent } from '../ui/card';


interface EnrollmentCardProps {
  enrollment: Enrollment;
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground leading-tight truncate">
            {enrollment.programDetails.name}
          </p>
        </div>
        <div className="w-24 shrink-0">
          {/* sample progress */}
          <ProgressBar value={20} showLabel />
        </div>
        <StatusBadge status={enrollment.status} />
      </CardContent>
    </Card>
  );
}