import { API } from "@/constants/api";
import { api } from "@/lib/api";

export const getEnrollmentApprovalsAPI = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) => {

  const res = await api.get(API.MANAGER.ENROLLMENTS, {
    params: {
      page,
      limit,
      search,
    },
  });

  return res.data;
};

export const takeEnrollmentActionAPI = async (
  enrollmentId: string,
  action: "approve" | "reject",
  note?: string
) => {
  const res = await api.patch(API.MANAGER.ENROLLMENT_ACTION(enrollmentId), {
    action,
    note,
  });

  return res.data;
};

export const getEmployeeTrainingHistoryAPI = async (enrollmentId: string) => {
  const res = await api.get(API.MANAGER.TRAINING_HISTORY(enrollmentId));

  return res.data;
};

// Manager Tour Approvals
export const getTourApprovalsAPI = async () => {
  const res = await api.get(API.MANAGER.TOUR_APPROVALS);
  return res.data;
};

export const takeTourManagerActionAPI = async (
  enrollmentId: string,
  action: "approve" | "reject",
  note?: string
) => {
  const res = await api.patch(API.MANAGER.TOUR_ACTION(enrollmentId), {
    action,
    note,
  });
  return res.data;
};

// CTD Main Enrollment Approval (training_dept_review)
export const getCtdPendingEnrollmentsAPI = async () => {
  const res = await api.get(API.TRAININGDEPT.PENDING);
  return res.data;
};

export const takeCtdJuniorActionAPI = async (
  enrollmentId: string,
  note?: string
) => {
  const res = await api.patch(API.TRAININGDEPT.JUNIOR_ACTION(enrollmentId), {
    action: "reviewed",
    note,
  });
  return res.data;
};

export const takeCtdSeniorActionAPI = async (
  enrollmentId: string,
  action: "approve" | "reject",
  note?: string
) => {
  const res = await api.patch(API.TRAININGDEPT.SENIOR_ACTION(enrollmentId), {
    action,
    note,
  });
  return res.data;
};

// CTD Tour Approvals
export const getCtdTourApprovalsAPI = async () => {
  const res = await api.get(API.TRAININGDEPT.TOUR_APPROVALS);
  return res.data;
};

export const takeCtdTourActionAPI = async (
  enrollmentId: string,
  action: "approve" | "reject",
  note?: string
) => {
  const res = await api.patch(API.TRAININGDEPT.TOUR_ACTION(enrollmentId), {
    action,
    note,
  });
  return res.data;
};


/**
 * Fetch detailed panel data for a single enrollment ID
 */
export const getEnrollmentPanelByIdAPI = async (id: string) => {
  const res = await api.get(`${ API.EMPLOYEE.ENROLLMENTPANEL }/${ id }`);
  return res.data;
};
