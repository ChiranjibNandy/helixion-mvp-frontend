// ─────────────────────────────────────────────
//  lib/jwt.js
//  JWT sign & verify helpers
// ─────────────────────────────────────────────

import jwt from 'jsonwebtoken'

const SECRET = "12345"
console.log(SECRET);
const EXPIRES = '7d'

/**
 * Sign a JWT token for a user
 * @param {{ id: string, email: string, role: string }} payload
 * @returns {string} signed token
 */
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES })
}

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {object|null} decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

/**
 * Extract Bearer token from Authorization header
 * @param {Request} request
 * @returns {string|null}
 */
export function extractToken(request) {
  const auth = request.headers.get('authorization') || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}
