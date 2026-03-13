// ─────────────────────────────────────────────
//  POST /api/auth/register
//  Creates a new user in MongoDB
// ─────────────────────────────────────────────

import { connectDB }  from '@/lib/mongodb'
import { signToken }  from '@/lib/jwt'
import { ok, err }    from '@/lib/apiResponse'
import User           from '@/models/User'

export async function POST(request) {
  try {
    const body = await request.json()
    const { username, email, password, role = 'employee' } = body

    // ── Validate input ──────────────────────
    if (!username?.trim()) return err('Username is required')
    if (!email?.trim())    return err('Email is required')
    if (!password)         return err('Password is required')
    if (password.length < 8)
      return err('Password must be at least 8 characters')

    // ── Connect to DB ───────────────────────
    await connectDB()

    // ── Check if user already exists ────────
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    })
    if (existingEmail) return err('An account with this email already exists', 409)

    const existingUsername = await User.findOne({
      username: username.trim(),
    })
    if (existingUsername) return err('This username is already taken', 409)

    // ── Create user (password hashed by pre-save hook) ──
    const user = await User.create({
      username: username.trim(),
      email:    email.toLowerCase().trim(),
      password,
      role,
    })

    // ── Sign JWT ────────────────────────────
    const token = signToken({
      id:       user._id.toString(),
      email:    user.email,
      username: user.username,
      role:     user.role,
    })

    // ── Return token + safe user object ─────
    return ok(
      {
        message: 'Account created successfully',
        token,
        user: user.toSafeObject(),
      },
      201
    )
  } catch (error) {
    console.error('[REGISTER ERROR]', error)

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)[0]?.message
      return err(message || 'Validation failed', 422)
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return err(`${field} already exists`, 409)
    }

    return err('Internal server error', 500)
  }
}
