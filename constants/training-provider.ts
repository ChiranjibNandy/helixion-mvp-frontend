import { StayType } from "@/types";
import { STAY_TYPES } from "./content";

export interface createProgramFormData {
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  stayTypes: StayType[];
  brochureFile: File | null;
  minParticipants: string;
  maxParticipants: string;
}

export const INITIAL_FORM_STATE: createProgramFormData = {
  title: "",
  startDate: "",
  endDate: "",
  venue: "",
  city: "",
  stayTypes: structuredClone(STAY_TYPES),
  brochureFile: null,
  minParticipants: "",
  maxParticipants: "",
};
