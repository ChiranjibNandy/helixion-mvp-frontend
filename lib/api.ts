import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

function getClientToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken_client="))
    ?.split("=")[1];
}

api.interceptors.request.use((config) => {
  const token = getClientToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || '';
      
      // Do not trigger global error UX for auth endpoints
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

      if (!isAuthEndpoint) {
        if (status === 401) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("api-unauthorized"));
          }
        } else if (status === 403) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("api-forbidden"));
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

