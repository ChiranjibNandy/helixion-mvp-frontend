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

// OSD Tour Approvals
export const getOsdTourApprovalsAPI = async () => {
  const res = await api.get(API.OSD.TOUR_APPROVALS);
  return res.data;
};

export const takeOsdTourActionAPI = async (
  enrollmentId: string,
  action: "approve" | "reject",
  note?: string
) => {
  const res = await api.patch(API.OSD.TOUR_ACTION(enrollmentId), {
    action,
    note,
  });
  return res.data;
};