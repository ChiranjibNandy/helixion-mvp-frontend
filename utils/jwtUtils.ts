export interface DecodedToken {
  id: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export function decodeJWT(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export function getRoleFromToken(token: string): string | null {
  const decoded = decodeJWT(token);
  return decoded?.role || null;
}
