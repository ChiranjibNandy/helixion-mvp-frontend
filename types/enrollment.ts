export interface EnrollmentApproval {
  _id: string;
  employeeId: {
    _id: string,
    name: string,
    designation: string,
    department: string
  };
  approve: boolean;

  currentStage: string;

  statusSummary: {
    enrollmentStatus: string;
  };

  programSnapshot: {
    title: string;
    startDate: string;
    endDate: string;
    venue: string;
  };

  travelAndStay: {
    purpose: string;
  };

  stayType: string;

  managerApproval: {
    action: string;
  };
}