import type { Enrollment } from '@/types';
import { EnrollmentCard } from './EnrollmentCard';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent } from '../ui/card';
import { t } from '@/lib/i18n'; 

interface MyEnrollmentsProps {
  enrollments: Enrollment[];
}

export function MyEnrollments({ enrollments }: MyEnrollmentsProps) {
  return (
    <section className="mb-5">
      <SectionHeading title={t('enrollment.title')} />

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-xs text-muted-foreground">
              {t('enrollment.empty')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {enrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </section>
  );
}