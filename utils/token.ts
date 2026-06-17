"use server"
import { cookies } from "next/headers";

export async function getAccessToken() {
  const cookieStore = cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function setAccessToken(token: string) {
  const cookieStore = cookies();
  // httpOnly for server-side reading (Next.js pages)
  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60,
    path: "/",
  });
  // non-httpOnly so client-side axios can read it for Authorization header
  cookieStore.set("accessToken_client", token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60,
    path: "/",
  });
}

/**
 * ✅ Remove access token (logout)
 */
export async function removeAccessToken() {
  const cookieStore = cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("accessToken_client");
}

/**
 * Decode JWT payload WITHOUT verifying signature
 * (Backend already verified the token)
 */
export async function decodeJwtPayload(
  token: string
) {
  try {
    const base64Url = token.split(".")[1];

    const json = Buffer
      .from(base64Url, "base64url")
      .toString("utf8");

    return JSON.parse(json);

  } catch {
    return {};
  }
}