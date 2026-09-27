import { api } from "@/lib/api";
import { API } from "@/constants/api";

export interface Program {
  _id: string;
  title: string;
  startDate: string;
  endDate?: string;
  venueName: string;
  status: string;
}

export type AttendanceDayStatus = "present" | "absent";

export interface AttendanceDayEntry {
  status: AttendanceDayStatus;
  markedAt: string;
}

export interface AttendanceEnrollmentRow {
  enrollmentId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  attendanceByDay: Record<string, AttendanceDayEntry | null>;
  notes: string;
  totalPresent: number;
  totalAbsent: number;
  totalPending: number;
  isComplete: boolean;
  hasAttendanceMarked: boolean;
}

export interface AttendanceGridResponse {
  programId: string;
  programTitle: string;
  programDates: { start: string; end: string; totalDays: number };
  enrollments: AttendanceEnrollmentRow[];
  summary: {
    byDay: Record<string, { present: number; absent: number; pending: number }>;
    totalEnrollments: number;
    programHasAttendance: boolean;
  };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface AttendanceGridQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "email";
  sortOrder?: "asc" | "desc";
}

export const attendanceService = {
  getPrograms: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await api.get(API.TRAININGPROVIDER.PROGRAMS, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }
  },

  getAttendanceGrid: async (programId: string, query: AttendanceGridQuery = {}): Promise<AttendanceGridResponse> => {
    const response = await api.get(API.TRAININGPROVIDER.ATTENDANCE(programId), { params: query });
    return response.data.data;
  },

  markAttendanceDay: async (
    programId: string,
    enrollmentId: string,
    date: string,
    status: AttendanceDayStatus | null
  ) => {
    const response = await api.patch(API.TRAININGPROVIDER.ATTENDANCE_SINGLE(programId, enrollmentId), {
      date,
      status,
    });
    return response.data.data;
  },

  updateAttendanceNotes: async (programId: string, enrollmentId: string, notes: string) => {
    const response = await api.patch(API.TRAININGPROVIDER.ATTENDANCE_NOTES(programId, enrollmentId), { notes });
    return response.data.data;
  },
};
