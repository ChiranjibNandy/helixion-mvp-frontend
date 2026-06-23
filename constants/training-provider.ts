import { StayType } from "@/types";
import { STAY_TYPES } from "./content";

export interface createProgramFormData {
  programTitle: string;
  startDate: string;
  endDate: string;
  venue: string;
  stayTypes: StayType[];
  brochureFile: File | null;
  minParticipants: string;
  maxParticipants: string;
}

export const INITIAL_FORM_STATE: createProgramFormData = {
  programTitle: "",
  startDate: "",
  endDate: "",
  venue: "",
  stayTypes: structuredClone(STAY_TYPES),
  brochureFile: null,
  minParticipants: "",
  maxParticipants: "",
};
