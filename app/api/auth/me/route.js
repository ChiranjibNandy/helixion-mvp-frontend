// ─────────────────────────────────────────────
//  GET /api/auth/me
//  Returns the currently authenticated user
//  Requires: Authorization: Bearer <token>
// ─────────────────────────────────────────────

import { connectDB }     from '@/lib/mongodb'
import { extractToken, verifyToken } from '@/lib/jwt'
import { ok, err }       from '@/lib/apiResponse'
import User              from '@/models/User'

export async function GET(request) {
  try {
    // ── Extract token ─────────────────────
    const token = extractToken(request)
    if (!token) return err('Not authenticated. Please sign in.', 401)

    // ── Verify token ──────────────────────
    const decoded = verifyToken(token)
    if (!decoded) return err('Invalid or expired session. Please sign in again.', 401)

    // ── Connect + fetch user ──────────────
    await connectDB()
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      return err('User not found or account deactivated.', 404)
    }

    return ok({ user: user.toSafeObject() })
  } catch (error) {
    console.error('[ME ERROR]', error)
    return err('Internal server error', 500)
  }
}
