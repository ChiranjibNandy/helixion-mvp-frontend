import type { Enrollment } from '@/types';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import Badge from '../ui/badge';
import { t } from '@/lib/i18n';

interface EnrollmentCardProps {
  enrollment: Enrollment;
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return t('enrollment.status.pending');
      case "active":
        return t('enrollment.status.active');
      case "completed":
        return t('enrollment.status.completed');
      default:
        return status;
    }
  };

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
          <Progress value={20} />
        </div>

        <Badge status={enrollment.status}>
          {getStatusLabel(enrollment.status)}
        </Badge>
      </CardContent>
    </Card>
  );
}