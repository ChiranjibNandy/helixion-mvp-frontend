import TrainingEnrolmentView from "@/components/dashboard/employee/TrainingEnrolmentView";
import EnrollmentApprovalProgressView from "@/components/dashboard/employee/EnrollmentApprovalProgressView";

interface EnrollmentsPageProps {
  searchParams: { programId?: string };
}

// With a programId in the URL (arrived via "Enroll" on a program card), this
// route is the enroll wizard. Without one (the main "Enrollments" nav item),
// it's the employee's own list of enrollments and their approval progress —
// previously nothing rendered here for that case.
export default function EnrollmentsPage({ searchParams }: EnrollmentsPageProps) {
  if (searchParams.programId) {
    return <TrainingEnrolmentView />;
  }
  return <EnrollmentApprovalProgressView />;
}
