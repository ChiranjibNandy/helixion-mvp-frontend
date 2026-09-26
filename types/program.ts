import { Pagination } from "./pagination";

export interface Program {
  _id:string,
  title: string;
  startDate: string;
  enrolledCount: number;
  maxParticipants: number;
  fillRate: number;
  /** Authoritative "sent to TP" count — see backend Program.confirmedEnrollmentCount */
  confirmedEnrollmentCount: number;
}


export interface ProgramsResponse {
  success: boolean;
  message: string;
  data: Program[];
  meta: Pagination;
}