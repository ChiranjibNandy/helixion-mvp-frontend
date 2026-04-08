import { MyEnrollments } from './MyEnrollments';
import { AvailableProgrammes } from './AvailableProgrammes';
import { fetchEmployeeDashboardData } from '@/utils/employeeService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/Alert';

async function EmployeeDashboardView({ accessToken }: { accessToken?: string }) {
  try {
    const { enrollments, availablePrograms } = await fetchEmployeeDashboardData(accessToken);
    return (
      <>
        <MyEnrollments enrollments={enrollments} />
        <AvailableProgrammes programmes={availablePrograms} />
      </>
    );
  } catch {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Unable to load your dashboard. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }
}

interface RoleDashboardViewProps {
  role: string;
  accessToken?: string;
}

export function RoleDashboardView({ role, accessToken }: RoleDashboardViewProps) {
  switch (role) {
    case 'manager':
    case 'admin':
    case 'employee':
    default:
      return <EmployeeDashboardView accessToken={accessToken} />;
  }
}