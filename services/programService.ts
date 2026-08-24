import { API } from "@/constants/api";
import { api } from "@/lib/api";
import { CreateProgramPayload } from "@/props/createprogramPayload";



export const createProgramAPI = async (
  payload: CreateProgramPayload
) => {
  const formData = new FormData();

  formData.append("title", payload.title);

  if (payload.startDate) {
    formData.append("startDate", payload.startDate);
  }

  if (payload.endDate) {
    formData.append("endDate", payload.endDate);
  }

  if (payload.venue) {
    formData.append("venue", payload.venue);
  }

  if (payload.city) {
    formData.append("city", payload.city);
  }

  // FEES
  if (payload.singleOccupancyFee != null) {
    formData.append(
      "singleOccupancyFee",
      String(payload.singleOccupancyFee)
    );
  }

  if (payload.twinSharingFee != null) {
    formData.append(
      "twinSharingFee",
      String(payload.twinSharingFee)
    );
  }

  if (payload.nonResidentialFee != null) {
    formData.append(
      "nonResidentialFee",
      String(payload.nonResidentialFee)
    );
  }

  // PARTICIPANTS
  if (payload.minParticipants != null) {
    formData.append(
      "minParticipants",
      String(payload.minParticipants)
    );
  }

  if (payload.maxParticipants != null) {
    formData.append(
      "maxParticipants",
      String(payload.maxParticipants)
    );
  }

  // STATUS
  formData.append("status", payload.status);

  // FILE
  if (payload.brochure) {
    formData.append("brochure", payload.brochure);
  }

  const response = await api.post(
    API.TRAININGPROVIDER.CREATEPROGRAM,
    formData
  );

  return response.data;
};


export interface GetProgramsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getProgramsAPI = async ({
  page = 1,
  limit = 10,
  search = "",
}: GetProgramsParams = {}) => {
  return await api.get(API.TRAININGPROVIDER.PROGRAM_LIST, {
    params: {
      page,
      limit,
      search: search || undefined,
    },
  });
};