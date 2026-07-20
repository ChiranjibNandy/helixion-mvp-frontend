import { PROGRAM_SAVED_STATUS } from "@/types";

export interface CreateProgramPayload {
  title: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  city?: string;

  singleOccupancyFee?: number;
  twinSharingFee?: number;
  nonResidentialFee?: number;

  brochure?: File | null;

  minParticipants?: number;
  maxParticipants?: number;

  status: PROGRAM_SAVED_STATUS;
}
