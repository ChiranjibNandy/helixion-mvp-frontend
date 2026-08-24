import { Pagination } from "./pagination";

export interface Program {
  _id:string,
  title: string;
  startDate: string;
  enrolledCount: number;
  maxParticipants: number;
  fillRate: number;
}


export interface ProgramsResponse {
  success: boolean;
  message: string;
  data: Program[];
  meta: Pagination;
}