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