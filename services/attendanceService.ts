import { api } from "@/lib/api";
import { API } from "@/constants/api";

export interface Program {
  _id: string;
  title: string;
  startDate: string;
  venueName: string;
  status: string;
}

export interface Participant {
  id: string;
  username: string;
  email: string;
}

export interface AttendanceRecord {
  participantId: string;
  present_status: "present" | "absent";
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

  getParticipants: async (programId: string) => {
    try {
      const response = await api.get(API.TRAININGPROVIDER.PARTICIPANTS(programId));
      return response.data;
    } catch (error) {
      console.error("Error fetching participants:", error);
      throw error;
    }
  },

  getAttendance: async (programId: string) => {
    try {
      const response = await api.get(API.TRAININGPROVIDER.ATTENDANCE(programId));
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  },

  saveAttendance: async (programId: string, date: string, participants: AttendanceRecord[]) => {
    try {
      const response = await api.put(API.TRAININGPROVIDER.ATTENDANCE(programId), {
        date,
        participants,
      });
      return response.data;
    } catch (error) {
      console.error("Error saving attendance:", error);
      throw error;
    }
  },
};
