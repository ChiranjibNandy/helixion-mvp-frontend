import { API } from "@/constants/api";
import { api } from "@/lib/api";


export const fetchEmployeeDashboardData = async () => {
  try {
    const response = await api.get(API.EMPLOYEE.DASHBOARD);
    return response.data.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};