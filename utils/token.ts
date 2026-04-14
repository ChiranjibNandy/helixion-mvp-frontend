import { cookies } from "next/headers";

export function getAccessToken() {
  const cookieStore = cookies();

  const token =
    cookieStore.get("accessToken")?.value;

  return token;
}

/**
 * ✅ Remove access token (logout)
 */
export function removeAccessToken() {
  const cookieStore = cookies();

  cookieStore.delete("accessToken");
}

/**
 * Decode JWT payload WITHOUT verifying signature
 * (Backend already verified the token)
 */
export function decodeJwtPayload(
  token: string
): Record<string, string> {
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