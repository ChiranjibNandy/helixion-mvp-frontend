import { api } from "@/lib/api";


export const fetchEmployeeDashboardData = async () => {
  try {
    const response = await api.get("/employee/dashboard");
    return response.data.data;
  } catch (error) {
    console.log(error)
  }
};