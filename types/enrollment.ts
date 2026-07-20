export interface EnrollmentApproval {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email?: string;
    designation?: string;
    department?: string;
  };
  approve: boolean;

  currentStage: string;

  statusSummary: {
    enrollmentStatus: string;
  };

  programId: {
    _id: string;
    title: string;
    startDate?: string;
    endDate?: string;
    venueName?: string;
    city?: string;
    brochureUrl?: string;
    trainingInstitute?: string;
  };

  notes?: string;

  travelAndStay: {
    stayType?: string;
    placeOfTour?: string;
    frequentFlyerNo?: string;
    modeOfTravel?: string;
    purpose?: string;
    advancePaymentRequired?: number;
    status?: string;
  };

  tour?: {
    status?: string;
    travelType?: string;
    details?: {
      placeOfTour?: string;
      frequentFlyerNo?: string;
      modeOfTravel?: string;
      purpose?: string;
      advancePaymentRequired?: number;
      bookingDetails?: any[];
    };
  };

  managerApproval: {
    action: string;
    note?: string;
  };
}

export interface EmployeeTrainingHistoryEntry {
  enrollmentId: string;
  program?: string;
  trainingInstitute?: string;
  from?: string;
  to?: string;
  venue?: string;
  brochureUrl?: string;
}