"use server"
import { cookies } from "next/headers";

export async function getAccessToken() {
  const cookieStore = cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function setAccessToken(token: string) {
  const cookieStore = cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: true,
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