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