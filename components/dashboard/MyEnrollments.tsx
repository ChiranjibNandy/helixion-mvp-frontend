import type { Enrollment } from '@/types';
import { EnrollmentCard } from './EnrollmentCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card, CardContent } from '../ui/card';

interface MyEnrollmentsProps {
  enrollments: Enrollment[];
}

export function MyEnrollments({ enrollments }: MyEnrollmentsProps) {
  return (
    <section className="mb-5">
      <SectionHeading title="My Enrollments" />
      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-xs text-muted-foreground">No enrollments yet.</p>
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