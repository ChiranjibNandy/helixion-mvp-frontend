import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function createApiClient(accessToken?: string) {
  const client = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
    withCredentials: true, // important for cookies
  });

  // ✅ Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    }
  );

  // ✅ Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      if (error.response) {
        const message =
          error.response.data?.message ||
          "Something went wrong while talking to the server.";

        throw new ApiError(message, error.response.status);
      }

      throw new ApiError(
        "Unable to connect to the server. Please try again in a moment."
      );
    }
  );

  return client;
}