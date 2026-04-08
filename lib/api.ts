// lib/api.ts
import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApiClient(accessToken?: string) {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
    withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      if (error.response) {
        const message =
          error.response.data?.message ??
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

export function getAccessTokenFromCookieHeader(cookieHeader?: string) {
  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(";");
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("accessToken=")
  );

  if (!accessTokenCookie) {
    return undefined;
  }

  return decodeURIComponent(accessTokenCookie.split("=")[1] ?? "");
}