// ─────────────────────────────────────────────
//  POST /api/auth/login
//  Authenticates a user and returns a JWT
// ─────────────────────────────────────────────

import { connectDB }  from '@/lib/mongodb'
import { signToken }  from '@/lib/jwt'
import { ok, err }    from '@/lib/apiResponse'
import User           from '@/models/User'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    // ── Validate input ──────────────────────
    if (!email?.trim()) return err('Email is required')
    if (!password)      return err('Password is required')

    // ── Connect to DB ───────────────────────
    await connectDB()

    // ── Find user (include password for comparison) ──
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password')

    if (!user) {
      // Vague message to prevent user enumeration
      return err('Invalid email or password', 401)
    }

    // ── Check account is active ──────────────
    if (!user.isActive) {
      return err('Your account has been deactivated. Contact support.', 403)
    }

    // ── Verify password ──────────────────────
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return err('Invalid email or password', 401)
    }

    // ── Optional: validate role matches ──────
    if (role && user.role !== role) {
      return err(
        `This account is registered as "${user.role}", not "${role}". Please select the correct role.`,
        403
      )
    }

    // ── Update lastLogin timestamp ────────────
    user.lastLogin = new Date()
    await user.save()

    // ── Sign JWT ──────────────────────────────
    const token = signToken({
      id:       user._id.toString(),
      email:    user.email,
      username: user.username,
      role:     user.role,
    })

    return ok({
      message: 'Login successful',
      token,
      user: user.toSafeObject(),
    })
  } catch (error) {
    console.error('[LOGIN ERROR]', error)
    return err('Internal server error', 500)
  }
}
