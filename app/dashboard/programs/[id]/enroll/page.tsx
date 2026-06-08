import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/navigation';

// Enrollment is now handled inline on the programs list page.
// Any direct navigation to this route is redirected back to programs.
export default function EnrollPage() {
  redirect(ROUTES.EMPLOYEE.PROGRAMS);
}
