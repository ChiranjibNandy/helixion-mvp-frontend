import { createApiClient } from "@/lib/api";

export const fetchEmployeeDashboardData = async (accessToken?: string) => {
  try {
    const client = createApiClient(accessToken);
    const response = await client.get("/employee/dashboard");
    return response.data.data;
  } catch (error) {
    console.log(error)
  }
};