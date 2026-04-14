import axios from "axios";
import { ApiError } from "next/dist/server/api-utils";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  withCredentials: true, 
});
 

api.interceptors.response.use(
  (res) => res,
  (error) => {
    throw new ApiError(
      error.response?.data?.message || "Something went wrong",
      error.response?.status
    );
  }
);

